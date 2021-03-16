"use strict";

const SummarizeQuery = require('../../../src/model/stats/SummarizeQuery');

describe( "SummarizeQuery", () => {
    describe( "from Postman Example", () => {
        it( "SummarizeQuery constructions", () => {
            expect(() => {new SummarizeQuery({})}).toThrow();

            let sq = new SummarizeQuery({
                "selectors": [
                    { "resource": "Patient", "filters": [], "fields": [{ "path": "gender" }]}
                ],
                "options": {
                    "measures": {
                        "continuous": ["count","mean","stdev","ci95"],
                        "categorical": ["count","mode"]
                    }
                }
            });

            expect(sq.selectors.length).toBeGreaterThan(0);
            expect(sq.selectors[0].resource).toBeDefined();
            expect(sq.selectors[0].fields.length).toBeGreaterThan(0);
            expect(sq.options.measures.continuous.length).toBeGreaterThan(0);
            expect(sq.options.measures.categorical.length).toBeGreaterThan(0);
        } );
    } );
} );



