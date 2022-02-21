import cognitoDetails from "./CognitoDetails";
import api from "./api";
import {Auth} from 'aws-amplify';
import axios from "axios";

// During CSV upload token sent by the java server might expire so we use upload-user for
// communicating the java server
export const setUploadUser = async () => {
    if (cognitoDetails.isEmpty()) {
        await api.getCognitoDetails().then((details) => {
            return cognitoDetails.setDetails(details);
        })
    }
    if(!cognitoDetails.isDummy()) {
        await setupUploadUser();
    }
};

const setupUploadUser = async () => {
    Auth.configure({
        region: 'ap-south-1',
        userPoolId: cognitoDetails.poolId,
        userPoolWebClientId: cognitoDetails.clientId
    });
    const currentUser = await Auth.currentUserInfo();
    if (_.isEmpty(currentUser)) {
        await sigIn();
    } else {
        await refreshToken();
    }
};

const sigIn = async () => {
    await Auth.signIn(process.env.OPENCHS_UPLOAD_USER_USER_NAME, process.env.OPENCHS_UPLOAD_USER_PASSWORD);
    await refreshToken()
};

const refreshToken = async () => {
    const currentSession = await Auth.currentSession();
    axios.defaults.headers.common["AUTH-TOKEN"] = currentSession.idToken.jwtToken;
};
