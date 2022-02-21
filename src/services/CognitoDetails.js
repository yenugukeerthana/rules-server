import {includes, isEmpty} from 'lodash';

class CognitoDetails {

    constructor(props) {
        this.clientId = '';
        this.poolId = ''
    }


    isEmpty() {
        return isEmpty(this.poolId) || isEmpty(this.clientId);
    }

    isDummy() {
        return includes([this.poolId, this.clientId], 'dummy')
    }

    setDetails({poolId, clientId}) {
        this.clientId = clientId;
        this.poolId = poolId;
    }
}

const cognitoDetails = new CognitoDetails();

export default cognitoDetails

