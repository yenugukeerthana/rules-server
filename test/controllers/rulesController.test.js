import {messagingResponse} from "../../src/controllers/rulesController";
import {getMockReq, getMockRes} from "@jest-mock/express";

test('evaluates schedule rule', async () => {
    const {res, next} = getMockRes({});

    const req = getMockReq({
        body: {
            rule: "'use strict'; " +
                "({params, imports}) => { return {'scheduledDateTime': '2013-02-04 10:35:24' }};",
            entity: {
                "uuid": "fdbbf07d-31f3-4752-a58e-cd0ef3c74e79",
                "firstName": "maha",
                "middleName": null,
                "lastName": "asam",
                "profilePicture": null,
                "dateOfBirth": [
                    2022,
                    10,
                    1
                ],
                "gender": {
                    "uuid": "ad7d1d14-54fd-45a2-86b7-ea329b744484",
                    "name": "Female"
                },
                "registrationDate": [
                    2022,
                    10,
                    19
                ],
                "lowestAddressLevel": {
                    "uuid": "9b4e6e5b-8335-4913-b398-097bd496a1ad",
                    "name": "Aldandi Village",
                    "version": 1,
                    "organisationId": 2,
                    "title": "Aldandi Village",
                    "level": 1
                },
                "observations": [],
                "voided": false,
                "registrationLocation": null,
                "subjectType": {
                    "name": "student",
                    "uuid": "bd0cb293-39aa-4c5f-861f-3127e938ec8c",
                    "type": "Person",
                    "allowEmptyLocation": false,
                    "allowMiddleName": false,
                    "allowProfilePicture": false,
                    "uniqueName": false,
                    "shouldSyncByLocation": false,
                    "directlyAssignable": false,
                    "household": false,
                    "group": false,
                    "voided": false
                },
                "rule": null,
                "enrolments": [],
                "encounters": [],
                "visitSchedules": null,
                "latestEntityApprovalStatus": null,
                "groups": []
            },
            entityType: "Subject"
        }
    });

    await messagingResponse(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({"scheduledDateTime": "2013-02-04 10:35:24"}),
    )
    expect(res.status).toHaveBeenCalledWith(200);
});