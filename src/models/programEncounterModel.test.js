import {mapProgramEncounter} from "./programEncounterModel";
import {assert} from 'chai';
import {ApprovalStatus} from 'openchs-models';
import moment from "moment";

it('should map program encounter', function () {
    const programEncounterRequest = {
        "uuid": "pe-uuid-1",
        "name": "pe-1",
        "encounterDateTime": new Date(),
        "earliestVisitDateTime": new Date(),
        "maxVisitDateTime": new Date(),
        "cancelDateTime": new Date(),
        "encounterType": {
            "uuid": "et-uuid-1",
            "name": "et-1"
        },
        "observations": [{
            "concept": {
                "uuid": "c-uuid-1"
            },
            "value": 101
        }],
        "entityApprovalStatuses": [
            {
                "uuid": "2",
                "approvalStatus": {
                    "status": ApprovalStatus.statuses.Approved
                },
                statusDateTime: moment().toDate()
            },
            {
                "uuid": "1",
                "approvalStatus": {
                    "status": ApprovalStatus.statuses.Pending
                },
                statusDateTime: moment().add(-1, "days").toDate()
            }
        ]
    };
    const programEncounter = mapProgramEncounter(programEncounterRequest);
    assert.equal(programEncounter.uuid, programEncounterRequest.uuid);
    assert.equal(programEncounter.encounterType.uuid, programEncounterRequest.encounterType.uuid);
    assert.equal(programEncounter.latestEntityApprovalStatus.uuid, "2");
});
