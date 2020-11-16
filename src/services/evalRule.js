import {common, motherCalculations} from "avni-health-modules";
import * as models from "openchs-models";
import lodash from "lodash";
import safeEval from "safe-eval";

const ruleServiceLibraryInterfaceForSharingModules = {
    log: console.log,
    common: common,
    motherCalculations: motherCalculations,
    models: models
};

const context = {console, ruleServiceLibraryInterfaceForSharingModules, _: lodash};

const evalRule = (code) => {
    return safeEval(code, context);
}

export default evalRule;