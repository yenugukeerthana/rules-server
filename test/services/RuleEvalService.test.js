import {scheduleRule} from "../../src/services/RuleEvalService";

test('evaluate schedule rule', async () => {
    const entity = {'name': 'ram'};
    const rule = "'use strict'; ({params, imports}) => { return {'scheduledDateTime': '2013-02-04 10:35:24' }};"
    const scheduledDateTime = await scheduleRule(rule, entity);

    expect(scheduledDateTime).toEqual({"scheduledDateTime": "2013-02-04 10:35:24"});
});