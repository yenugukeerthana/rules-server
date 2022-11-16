import {mapProgramEncounter} from "./programEncounterModel";
import {assert} from 'chai';

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
        }]
    };
    const programEncounter = mapProgramEncounter(programEncounterRequest);
    assert.equal(programEncounter.uuid, programEncounterRequest.uuid);
    assert.equal(programEncounter.encounterType.uuid, programEncounterRequest.encounterType.uuid);
});
