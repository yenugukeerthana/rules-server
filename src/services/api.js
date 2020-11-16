import axios from "axios";
import {get} from "lodash";

const BASE_URL = "http://localhost:8021";

export default {
    getLegacyRulesBundle: () =>
        axios
            .get(
                BASE_URL + "/ruleDependency/search/lastModified?lastModifiedDateTime=1900-01-01T00:00:00.000Z&size=1000"
            )
            .then(response => get(response, "data._embedded.ruleDependency[0].code")),
    getLegacyRules: () =>
        axios
            .get(BASE_URL + "/rule/search/lastModified?lastModifiedDateTime=1900-01-01T00:00:00.000Z&size=1000")
            .then(response => get(response, "data._embedded.rule"))
};
