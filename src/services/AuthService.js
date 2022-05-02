import cognitoDetails from "./CognitoDetails";
import api from "./api";
import {Auth} from 'aws-amplify';

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
    if (_.isEmpty(currentUser) || currentUser.username !== 'upload-user') {
        await sigIn();
    }
};

const sigIn = async () => {
    await Auth.signIn(process.env.OPENCHS_UPLOAD_USER_USER_NAME, process.env.OPENCHS_UPLOAD_USER_PASSWORD);
};

export const getUploadUserToken = async () => {
    const currentSession = await Auth.currentSession();
    return currentSession.idToken.jwtToken;
};
