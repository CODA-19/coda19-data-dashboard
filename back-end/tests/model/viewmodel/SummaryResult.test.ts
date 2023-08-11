import SummaryResult from "../../../src/model/viewmodel/SummaryResult";
import fs from "fs";
import JSON5 from 'json5';
import {SummarizeRequestBody, SummaryOperator} from "../../../coda19-ts/src/request/SummarizeRequest";

const received_1 = JSON5.parse(fs.readFileSync('./mock/tasks/received_task_1.json5').toString());
const returned_1 = JSON5.parse(fs.readFileSync('./mock/tasks/ret_task_1.json5').toString());
const req1:SummarizeRequestBody = {
    "selectors": [
        {
            "resource": "Patient",
            "label": "patientResource",
            "filters": [
                { "path": "deceasedBoolean", "operator": <SummaryOperator>"is", "value": "false", "type": "boolean" }
            ],
            "fields": [
                { "path": "gender", "label": "gender" },
                { "path": "age", "label": "age" }
            ]
        }
    ],
    "options": {
        "measures": {
            "continuous": [ "count", "mean", "stdev", "ci95" ],
            "categorical": [ "count", "mode" ]
        }
    }
};
const received_2 = JSON5.parse(fs.readFileSync('./mock/tasks/received_task_2.json5').toString());
const returned_2 = JSON5.parse(fs.readFileSync('./mock/tasks/ret_task_2.json5').toString());
const req2:SummarizeRequestBody = {
    "selectors": [
        {
            "resource": "Patient",
            "label": "patientResource",
            "filters": [
                { "path": "deceasedBoolean", "operator": <SummaryOperator>"is", "value": "true", "type": "boolean" },
                { "path": "deceasedDateTime", "operator": <SummaryOperator>"isNot", "value": "null", "type": "dateTime" }
            ],
            "fields": [],
            "breakdown": {
                "resource": { "type": "Patient", "field": "deceasedDateTime" },
                "slices": { "step": 1209600, "min": "2021-01-01", "max": "2021-04-06" }
            }
        }
    ],
    "options": {
        "measures": {
            "continuous": [],
            "categorical": [ "count" ]
        }
    }
};

describe( "SummaryResult", () => {

    describe( "from task 1", () => {

        it( "SummaryResult process task 1", () => {
            let processed = SummaryResult.fromSummary(req1, received_1);
            // basic keys
            expect(Object.keys(processed)).toEqual(Object.keys(returned_1));
            // Generic compare.
            expect(processed.request).toEqual(returned_1.request);
            expect(processed.data).toEqual(returned_1.data);
        } );

        it( "SummaryResult process task 4", () => {
            let processed = SummaryResult.fromSummary(req2, received_2);
            // basic keys
            expect(Object.keys(processed)).toEqual(Object.keys(returned_2));
            // Generic compare.
            expect(processed.request).toEqual(returned_2.request);
            expect(processed.data).toEqual(returned_2.data);
        } );
    } );
} );



