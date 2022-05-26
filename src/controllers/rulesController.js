import {executeRule, executeSummaryRule} from '../RuleExecutor';
import {ORGANISATION_UUID_HEADER, AUTH_TOKEN_HEADER, USER_NAME_HEADER} from "./UserHeaders";
import axios from "axios";
import cache from "../services/cache";
import {BuildObservations} from "../observationBuilder/BuildObservations";
import {setUploadUser} from "../services/AuthService";
import {get} from 'lodash';

export const rulesController = async (req, res, next) => {
    try {
        setGlobalAxiosHeaders(req);
        const ruleResponse = await executeRule(req.body);
        ruleResponse.status = "success";
        res.status(200).json(ruleResponse);
    } catch (err) {
        catchRuleError(err, res);
    }
}

export const summary = async (req, res, next) => {
    try {
        setGlobalAxiosHeaders(req);
        const ruleResponse = await executeSummaryRule(req.body);
        ruleResponse.status = "success";
        res.status(200).json(ruleResponse);
    } catch (err) {
        catchRuleError(err, res);
    }
};

function catchRuleError(err, res) {
    console.log(err);
    res.status(222)
        .json({
            status: 'failure',
            error: {
                message: err.message,
                stack: err.stack
            }
        })
}

export const cleanRulesCache = async (req, res, next) => {
    const orgUuid = axios.defaults.headers.common[ORGANISATION_UUID_HEADER];
    delete cache[orgUuid];
    res.status(200).send('Cleaned the rules bundle cache');
}

const setGlobalAxiosHeaders = (req) => {
    const userName = req.get(USER_NAME_HEADER);
    const authToken = req.get(AUTH_TOKEN_HEADER);
    const orgUuid = req.get(ORGANISATION_UUID_HEADER);
    console.log(`Headers from req: ${userName} ${authToken} ${orgUuid}`);

    if(userName)
        axios.defaults.headers.common[USER_NAME_HEADER] = userName;
    if(authToken)
        axios.defaults.headers.common[AUTH_TOKEN_HEADER] = authToken;
    if(orgUuid)
        axios.defaults.headers.common[ORGANISATION_UUID_HEADER] = orgUuid;
}


export const buildObservationAndRunRules = async (req, res, next) => {
    try {
        setGlobalAxiosHeaders(req);
        await setUploadUser();
        const responseContract = await BuildObservations(req.body);
        res.status(200).json(responseContract);
    } catch (err) {
        res.status(222)
            .json({
                errors: [`Error in rule server. Message: "${get(err, 'message')}", Stack: "${get(err, 'stack')}"`]
            })
    }
};
