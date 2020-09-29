import db from '../../server/db';

class BaseService {
    constructor(){
        this.db = db;
    }
}

export default BaseService;