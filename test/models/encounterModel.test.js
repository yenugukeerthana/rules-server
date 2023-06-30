import {mapEncounter} from "../../src/models/encounterModel";
import {assert} from 'chai';

it('should map non-repeatable question group observations of encounter', function () {
    const encounterRequest = {
        "observations": [{
            "concept": {
                "uuid": "37fc6225-09f4-497c-a6b4-6a0a29e344ef",
                "name": "attendance",
                "datatype": "QuestionGroup",
                "lowAbsolute": null,
                "hiAbsolute": null,
                "lowNormal": null,
                "unit": null,
                "keyValues": null,
                "voided": false,
                "answers": null
            },
            "value": [{
                "concept": {
                    "name": "date of attendance",
                    "uuid": "be061621-fb69-496b-b1b7-3c6b676a9783",
                    "dataType": "Date",
                    "answers": [],
                    "active": true
                }, "value": "2023-05-31T18:30:00.000Z"
            }]
        }],
        "rule": null,
        "subject": {
            "uuid": "c49a3576-deb4-40a5-8524-a9fa1eb07883",
            "firstName": "maha",
            "middleName": null,
            "lastName": "lakshme",
            "profilePicture": null,
            "dateOfBirth": [2000, 6, 30],
            "gender": {"uuid": "39c6b79d-e7ed-4621-a465-9860b4281dfe", "name": "Female", "voided": false},
            "registrationDate": [2023, 6, 30],
            "lowestAddressLevel": {
                "uuid": "2f773e33-7123-4607-8efc-69d64c123f46",
                "name": "new",
                "organisationId": 7,
                "title": "new",
                "level": 0
            },
            "observations": [],
            "voided": false,
            "registrationLocation": null,
            "subjectType": {
                "name": "beneficiary",
                "uuid": "6505e0b9-135d-44e4-a824-801960de5499",
                "type": "Person",
                "allowEmptyLocation": false,
                "allowMiddleName": false,
                "lastNameOptional": false,
                "allowProfilePicture": false,
                "uniqueName": false,
                "shouldSyncByLocation": false,
                "directlyAssignable": false,
                "household": false,
                "group": false,
                "voided": false
            },
            "rule": null,
            "enrolments": [],
            "encounters": [{
                "observations": [{
                    "concept": {
                        "uuid": "37fc6225-09f4-497c-a6b4-6a0a29e344ef",
                        "name": "attendance",
                        "datatype": "QuestionGroup",
                        "lowAbsolute": null,
                        "hiAbsolute": null,
                        "lowNormal": null,
                        "unit": null,
                        "keyValues": null,
                        "voided": false,
                        "answers": null
                    },
                    "value": [{
                        "concept": {
                            "name": "date of attendance",
                            "uuid": "be061621-fb69-496b-b1b7-3c6b676a9783",
                            "dataType": "Date",
                            "answers": [],
                            "active": true
                        }, "value": "2023-05-31T18:30:00.000Z"
                    }]
                }],
                "rule": null,
                "subject": null,
                "uuid": "7ba8b929-a49b-4724-a593-270efc870562",
                "name": null,
                "encounterType": {
                    "name": "visit",
                    "uuid": "66368594-5b7c-4192-bce7-4916b972bc04",
                    "entityEligibilityCheckRule": "",
                    "active": true,
                    "immutable": false
                },
                "cancelDateTime": null,
                "earliestVisitDateTime": null,
                "maxVisitDateTime": null,
                "encounterDateTime": 1688120947000,
                "cancelObservations": null,
                "voided": false,
                "visitSchedules": null,
                "entityApprovalStatuses": []
            }],
            "visitSchedules": null,
            "groups": [],
            "entityApprovalStatuses": []
        },
        "uuid": "7ba8b929-a49b-4724-a593-270efc870562",
        "name": null,
        "encounterType": {
            "name": "visit",
            "uuid": "66368594-5b7c-4192-bce7-4916b972bc04",
            "entityEligibilityCheckRule": "",
            "active": true,
            "immutable": false
        },
        "cancelDateTime": null,
        "earliestVisitDateTime": null,
        "maxVisitDateTime": null,
        "encounterDateTime": 1688120947000,
        "cancelObservations": null,
        "voided": false,
        "visitSchedules": null,
        "entityApprovalStatuses": []
    };

    const encounter = mapEncounter(encounterRequest);
    let dateGroupObservationValue = encounter.getObservationValue("date of attendance", "attendance");
    assert.equal(encounter.uuid, encounterRequest.uuid);
    assert.equal(dateGroupObservationValue, "2023-05-31T18:30:00.000Z");
});

it('should map repeatable question group observations of encounter', function () {
    const encounterRequest = {
        "observations": [{
            "concept": {
                "uuid": "37fc6225-09f4-497c-a6b4-6a0a29e344ef",
                "name": "attendance",
                "datatype": "QuestionGroup",
                "lowAbsolute": null,
                "hiAbsolute": null,
                "lowNormal": null,
                "unit": null,
                "keyValues": null,
                "voided": false,
                "answers": null
            },
            "value": [[{
                "concept": {
                    "name": "date of attendance",
                    "uuid": "be061621-fb69-496b-b1b7-3c6b676a9783",
                    "dataType": "Date",
                    "answers": [],
                    "active": true
                }, "value": "2023-05-26T18:30:00.000Z"
            }], [{
                "concept": {
                    "name": "date of attendance",
                    "uuid": "be061621-fb69-496b-b1b7-3c6b676a9783",
                    "dataType": "Date",
                    "answers": [],
                    "active": true
                }, "value": "2023-05-27T18:30:00.000Z"
            }]]
        }],
        "rule": null,
        "subject": {
            "uuid": "9228285a-8db1-491e-b748-a54ea1f9751f",
            "firstName": "lava",
            "middleName": null,
            "lastName": "kusha",
            "profilePicture": null,
            "dateOfBirth": [2000, 6, 30],
            "gender": {"uuid": "39c6b79d-e7ed-4621-a465-9860b4281dfe", "name": "Female", "voided": false},
            "registrationDate": [2023, 6, 30],
            "lowestAddressLevel": {
                "uuid": "2f773e33-7123-4607-8efc-69d64c123f46",
                "name": "new",
                "organisationId": 7,
                "title": "new",
                "level": 0
            },
            "observations": [],
            "voided": false,
            "registrationLocation": null,
            "subjectType": {
                "name": "beneficiary",
                "uuid": "6505e0b9-135d-44e4-a824-801960de5499",
                "type": "Person",
                "allowEmptyLocation": false,
                "allowMiddleName": false,
                "lastNameOptional": false,
                "allowProfilePicture": false,
                "uniqueName": false,
                "shouldSyncByLocation": false,
                "directlyAssignable": false,
                "household": false,
                "group": false,
                "voided": false
            },
            "rule": null,
            "enrolments": [],
            "encounters": [{
                "observations": [{
                    "concept": {
                        "uuid": "37fc6225-09f4-497c-a6b4-6a0a29e344ef",
                        "name": "attendance",
                        "datatype": "QuestionGroup",
                        "lowAbsolute": null,
                        "hiAbsolute": null,
                        "lowNormal": null,
                        "unit": null,
                        "keyValues": null,
                        "voided": false,
                        "answers": null
                    },
                    "value": [[{
                        "concept": {
                            "name": "date of attendance",
                            "uuid": "be061621-fb69-496b-b1b7-3c6b676a9783",
                            "dataType": "Date",
                            "answers": [],
                            "active": true
                        }, "value": "2023-05-26T18:30:00.000Z"
                    }], [{
                        "concept": {
                            "name": "date of attendance",
                            "uuid": "be061621-fb69-496b-b1b7-3c6b676a9783",
                            "dataType": "Date",
                            "answers": [],
                            "active": true
                        }, "value": "2023-05-27T18:30:00.000Z"
                    }]]
                }],
                "rule": null,
                "subject": null,
                "uuid": "ce97fdcc-8d4b-43f0-b3f2-b4473008c827",
                "name": null,
                "encounterType": {
                    "name": "repeatable visit",
                    "uuid": "3f972def-f41e-46c6-b8bf-8a2564c6ef30",
                    "entityEligibilityCheckRule": "",
                    "active": true,
                    "immutable": false
                },
                "cancelDateTime": null,
                "earliestVisitDateTime": null,
                "maxVisitDateTime": null,
                "encounterDateTime": 1688116665000,
                "cancelObservations": null,
                "voided": false,
                "visitSchedules": null,
                "entityApprovalStatuses": []
            }],
            "visitSchedules": null,
            "groups": [],
            "entityApprovalStatuses": []
        },
        "uuid": "ce97fdcc-8d4b-43f0-b3f2-b4473008c827",
        "name": null,
        "encounterType": {
            "name": "repeatable visit",
            "uuid": "3f972def-f41e-46c6-b8bf-8a2564c6ef30",
            "entityEligibilityCheckRule": "",
            "active": true,
            "immutable": false
        },
        "cancelDateTime": null,
        "earliestVisitDateTime": null,
        "maxVisitDateTime": null,
        "encounterDateTime": 1688116665000,
        "cancelObservations": null,
        "voided": false,
        "visitSchedules": null,
        "entityApprovalStatuses": []
    };

    const encounter = mapEncounter(encounterRequest);
    const repeatableGroupObservationsAfterMapping = encounter.findGroupedObservation("attendance");
    assert.equal(encounter.uuid, encounterRequest.uuid);
    assert.equal(repeatableGroupObservationsAfterMapping[0].groupObservations[0].getValue(), "2023-05-26T18:30:00.000Z", );
    assert.equal(repeatableGroupObservationsAfterMapping[1].groupObservations[0].getValue(), "2023-05-27T18:30:00.000Z");
});
