import {messagingRule, trimDecisionsMap} from "../../src/services/RuleEvalService";
import {forEach, isEmpty, reject} from 'lodash';

test('evaluate schedule rule', async () => {
    const entity = {'name': 'ram'};
    const rule = "'use strict'; ({params, imports}) => { return {'scheduledDateTime': '2013-02-04 10:35:24' }};"
    const scheduledDateTime = await messagingRule(rule, entity);

    expect(scheduledDateTime).toEqual({"scheduledDateTime": "2013-02-04 10:35:24"});
});

test('evaluate decisionsMap to return value for numeric concept', async () => {
    const decisionsMap = {
        encounterDecisions: [{name: "Abc calculated", value: 1.2}]
    };
    expect(trimDecisionsMap(decisionsMap)).toEqual(decisionsMap);
});

test('evaluate decisionsMap to return value for string concept within quotes', async () => {
    const decisionsMap = {
        encounterDecisions: [{name: "Abc calculated", value: "1.2"}]
    };
    expect(trimDecisionsMap(decisionsMap)).toEqual(decisionsMap);
});

test('evaluate decisionsMap to return value for single coded concept ', async () => {
    const decisionsMap = {
        encounterDecisions: [{name: "Abc calculated", value: "fad2483b-c1a8-4f86-a4d2-0a2939cff5ad"}]
    };
    expect(trimDecisionsMap(decisionsMap)).toEqual(decisionsMap);
});

test('evaluate decisionsMap to return value for multiple coded concepts', async () => {
    const decisionsMap = {
        encounterDecisions: [{name: "Abc calculated", value: ["fad2483b-c1a8-4f86-a4d2-0a2939cff5ad", "eef95e09-41ba-41f7-94fc-7bb7211efc3c"]}]
    };
    expect(trimDecisionsMap(decisionsMap)).toEqual(decisionsMap);
});

test('evaluate decisionsMap to return value for Boolean', async () => {
    const decisionsMap = {
        encounterDecisions: [{name: "Abc calculated", value: true}]
    };
    expect(trimDecisionsMap(decisionsMap)).toEqual(decisionsMap);
});

test('evaluate decisionsMap to return value for null', async () => {
    const decisionsMap = {
        encounterDecisions: [{name: "Abc calculated", value: null}]
    };
    expect(trimDecisionsMap(decisionsMap)).toEqual({encounterDecisions: []});
});

test('evaluate decisionsMap to return value for empty string', async () => {
    const decisionsMap = {
        encounterDecisions: [{name: "Abc calculated", value: ""}]
    };
    expect(trimDecisionsMap(decisionsMap)).toEqual({encounterDecisions: []});
});