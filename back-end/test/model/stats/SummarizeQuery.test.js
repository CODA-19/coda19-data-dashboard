"use strict";

const SummarizeQuery = require('../../model/stats/SummmarizeQuery');

describe( "SummarizeQuery", () => {
    describe( "from Postman Example", () => {
        it( "empty should not work without asserts", () => {
            new SummarizeQuery({});
        } );
    } );
} );