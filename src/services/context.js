const USER_NAME_HEADER = "USER-NAME";
const AUTH_TOKEN_HEADER = "AUTH-TOKEN";
const ORGANISATION_UUID = "ORGANISATION-UUID";

class Context {
    set(req) {
        const userName = req.get(USER_NAME_HEADER);
        const authToken = req.get(AUTH_TOKEN_HEADER);
        const orgUuid = req.get(ORGANISATION_UUID);
    }
}

export default new Context();