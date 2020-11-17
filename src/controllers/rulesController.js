import {executeRule} from '../RuleExecutor';
import {ORGANISATION_UUID_HEADER, AUTH_TOKEN_HEADER, USER_NAME_HEADER} from "./UserHeaders";
import axios from "axios";

export const rulesController = async (req, res, next) => {
    try {
        setGlobalAxiosHeaders(req);
        const ruleResponse = await executeRule(req.body);
        ruleResponse.status = "success";
        res.status(200).json(ruleResponse);
    } catch (err) {
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
