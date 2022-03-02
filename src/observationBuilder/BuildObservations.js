import {mapForm} from "../models/FormModel";
import {
    chain,
    differenceWith,
    filter,
    flatMap,
    forEach,
    get,
    head,
    isEmpty,
    isNil,
    map,
    remove,
    replace,
    size,
    startCase,
    toNumber,
    trim
} from 'lodash';
import {
    Concept,
    FormElementGroup,
    ObservationsHolder,
    ValidationResult,
} from "openchs-models";
import moment from "moment";
import {decisionRule, getFormElementsStatuses, visitScheduleRule} from "../services/RuleEvalService";
import {mapIndividual} from "../models/individualModel";
import {mapEncounter} from "../models/encounterModel";
import {mapProgramEncounter} from "../models/programEncounterModel";
import {mapProgramEnrolment} from "../models/programEnrolmentModel";
import {transformVisitScheduleDates} from "../RuleExecutor";
import api from "../services/api";

const DATE_FORMAT = `YYYY-MM-DD`;
const TIME_FORMAT = 'HH:mm';

const formTypeToEntityMapper = {
    IndividualProfile: mapIndividual,
    Encounter: mapEncounter,
    ProgramEncounter: mapProgramEncounter,
    ProgramEnrolment: mapProgramEnrolment,
};

export const BuildObservations = async ({row, form, entity}) => {
    const entityModel = formTypeToEntityMapper[form.formType](entity);
    const observationsHolder = new ObservationsHolder(entityModel.observations);
    const errors = [];
    const formModel = mapForm(form);
    const allValidationResults = [];
    const handleValidationResults = (validationResults) => {
        validationResults.forEach((validationResult) => handleValidationResult(validationResult));
    };
    const handleValidationResult = (validationResult) => {
        remove(allValidationResults, (existingValidationResult) => existingValidationResult.formIdentifier === validationResult.formIdentifier);
        if (!validationResult.success) {
            allValidationResults.push(validationResult);
        }
    };
    for (const feg of formModel.getFormElementGroups()) {
        for (const fe of feg.getFormElements()) {
            const concept = fe.concept;
            await addObservationValue(observationsHolder, concept, fe, trim(row[concept.name]), errors);
            entityModel.observations = observationsHolder.observations;
            const formElementStatuses = getFormElementStatuses(entityModel, feg, observationsHolder);
            const filteredFormElements = FormElementGroup._sortedFormElements(feg.filterElements(formElementStatuses));
            observationsHolder.updatePrimitiveCodedObs(filteredFormElements, formElementStatuses);
            const obsValue = observationsHolder.getObservationReadableValue(concept);
            const validationResults = validate(
                fe,
                obsValue,
                observationsHolder.observations,
                allValidationResults,
                formElementStatuses
            );
            handleValidationResults(validationResults);
        }
    }
    pushErrorMessages(formModel, allValidationResults, errors);
    const observations = map(entityModel.observations, (obs) => obs.toResource);
    const responseObject = {observations, errors};

    if (size(errors) > 0) {
        //return fast and don't run rules
        return responseObject
    }
    if (!isEmpty(formModel.decisionRule)) {
        const payload = {decisionCode: formModel.decisionRule, formUuid: formModel.uuid};
        responseObject.decisions = await decisionRule(payload, entityModel);
    }
    if (!isEmpty(formModel.visitScheduleRule)) {
        const payload = {visitScheduleCode: formModel.visitScheduleRule, formUuid: formModel.uuid};
        responseObject.visitSchedules = transformVisitScheduleDates(await visitScheduleRule(payload, entityModel, []));
    }
    return responseObject;
};

const pushErrorMessages = (form, allValidationResults, errors) => {
    const validationErrors = filter(allValidationResults, ({success}) => !success);
    if (size(validationErrors) === 0) {
        return
    }
    forEach(validationErrors, ({formIdentifier, messageKey}) => {
        const formElement = getFormElementByUUID(form, formIdentifier);
        const readableMessage = messageKey === 'emptyValidationMessage' ? 'Empty value not allowed' : startCase(messageKey);
        errors.push(`Column: "${get(formElement, 'concept.name')}" Error message: "${readableMessage}."`)
    })
};

async function addObservationValue(observationsHolder, concept, fe, answerValue, errors) {
    switch (concept.datatype) {
        case Concept.dataType.Coded:
            if (fe.isMultiSelect()) {
                const providedAnswers = splitMultiSelectAnswer(answerValue);
                const answerUUIDs = [];
                forEach(providedAnswers, answerName => {
                    const conceptAnswer = concept.getAnswerWithConceptName(answerName);
                    if (!isNil(conceptAnswer)) {
                        answerUUIDs.push(conceptAnswer.concept.uuid)
                    } else {
                        errors.push(`Column: "${concept.name}" Error message: "Answer concept ${answerName} not found."`)
                    }
                });
                observationsHolder.addOrUpdateObservation(concept, answerUUIDs);
            } else {
                const conceptAnswer = concept.getAnswerWithConceptName(answerValue);
                if (!isNil(conceptAnswer)) {
                    observationsHolder.addOrUpdateObservation(concept, conceptAnswer.concept.uuid);
                } else {
                    errors.push(`Column: "${concept.name}" Error message: "Answer concept ${answerValue} not found."`);
                }
            }
            break;
        case Concept.dataType.Numeric: {
            const value = toNumber(answerValue);
            observationsHolder.addOrUpdatePrimitiveObs(concept, value);
            break;
        }
        case Concept.dataType.Date: {
            const value = moment(answerValue).format(DATE_FORMAT);
            observationsHolder.addOrUpdatePrimitiveObs(concept, value);
            break;
        }
        case Concept.dataType.DateTime: {
            const value = moment(answerValue).toISOString();
            observationsHolder.addOrUpdatePrimitiveObs(concept, value);
            break;
        }
        case Concept.dataType.Time: {
            const value = moment(answerValue, TIME_FORMAT).format(TIME_FORMAT);
            observationsHolder.addOrUpdatePrimitiveObs(concept, value);
            break;
        }
        case Concept.dataType.PhoneNumber:
            observationsHolder.updatePhoneNumberValue(concept, answerValue, false);
            break;
        case Concept.dataType.Image:
        case Concept.dataType.Video: {
            const oldValue = observationsHolder.getObservationReadableValue(concept);
            const {value, error} = await api.uploadToS3(answerValue, oldValue);
            if (error) {
                errors.push(`Column: "${concept.name}" Error message: "${error}"`)
            }
            observationsHolder.addOrUpdatePrimitiveObs(concept, value);
            break;
        }
        case Concept.dataType.Subject: {
            const {value} = await api.getSubjectOrLocationObsValue(Concept.dataType.Subject, answerValue, fe.uuid);
            observationsHolder.addOrUpdatePrimitiveObs(concept, value);
            break;
        }
        case Concept.dataType.Location: {
            const {value} = await api.getSubjectOrLocationObsValue(Concept.dataType.Location, answerValue, fe.uuid);
            observationsHolder.addOrUpdatePrimitiveObs(concept, value);
            break;
        }
        default:
            observationsHolder.addOrUpdatePrimitiveObs(concept, answerValue);
            break;
    }
}

const getFormElementByUUID = (form, formElementUUID) => {
    let formElement;
    _.forEach(form.nonVoidedFormElementGroups(), (formElementGroup) => {
        const foundFormElement = _.find(
            formElementGroup.getFormElements(),
            (formElement) => formElement.uuid === formElementUUID
        );
        if (!_.isNil(foundFormElement)) formElement = foundFormElement;
    });
    return formElement;
};

const getFormElementStatuses = (entity, formElementGroup, observationsHolder) => {
    const formElementStatuses = getFormElementsStatuses(entity, formElementGroup);
    const filteredFormElements = FormElementGroup._sortedFormElements(
        formElementGroup.filterElements(formElementStatuses)
    );
    const removedObs = observationsHolder.removeNonApplicableObs(
        formElementGroup.getFormElements(),
        filteredFormElements
    );
    if (isEmpty(removedObs)) {
        return formElementStatuses;
    }
    return getFormElementStatuses(entity, formElementGroup, observationsHolder);
};

const splitMultiSelectAnswer = str => {
    return chain(str)
        .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
        .map(value => replace(trim(value), /"/g, ""))
        .value();
};

const getRuleValidationErrors = formElementStatuses => {
    return flatMap(
        formElementStatuses,
        status =>
            new ValidationResult(
                isEmpty(status.validationErrors),
                status.uuid,
                head(status.validationErrors)
            )
    );
};

const checkValidationResult = (ruleValidationErrors, validationResult) => {
    return map(ruleValidationErrors, error =>
        error.formIdentifier === validationResult.formIdentifier && !validationResult.success
            ? validationResult
            : error
    );
};

const addPreviousValidationErrors = (ruleValidationErrors, validationResult, previousErrors) => {
    const otherFEFailedStatuses = previousErrors.filter(
        ({formIdentifier, success}) => validationResult.formIdentifier !== formIdentifier && !success
    );
    return [
        ...checkValidationResult(ruleValidationErrors, validationResult),
        ...otherFEFailedStatuses
    ];
};

const validate = (formElement, value, observations, validationResults, formElementStatuses) => {
    const validationResult = formElement.validate(value);
    remove(
        validationResults,
        existingValidationResult =>
            existingValidationResult.formIdentifier === validationResult.formIdentifier
    );
    const ruleValidationErrors = getRuleValidationErrors(formElementStatuses);
    const hiddenFormElementStatus = filter(
        formElementStatuses,
        status => status.visibility === false
    );
    const ruleErrorsAdded = addPreviousValidationErrors(
        ruleValidationErrors,
        validationResult,
        validationResults
    );
    remove(ruleErrorsAdded, result => result.success);
    return differenceWith(
        ruleErrorsAdded,
        hiddenFormElementStatus,
        (a, b) => a.formIdentifier === b.uuid
    );
};
