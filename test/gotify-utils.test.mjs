import { expect } from 'chai';
import sinon from 'sinon';

import fetch from 'node-fetch';
import * as gotifyUtils from '../util/gotify-utils.mjs';
// import octokitUtils from '../util/octokit-utils.mjs';

function mockResponse() {
    return new fetch.Response(JSON.stringify({}), {
        status: 201,
        headers: { 'Content-type': 'application/json' }
    });
}

beforeEach(() => {

    // sinon.stub(octokitUtils, "retrieveLatestReleaseInformation");
    sinon.stub(fetch, 'Promise').returns(Promise.resolve(mockResponse()));
});

afterEach(() => {
    fetch.Promise.restore();
})

const softwareStub = [
    {
        name: "uu-notify",
        feedUrl: "https://github.com/franok/uu-notify/releases.atom",
        github: {
            org: "franok",
            repo: "uu-notify"
        }
    }
];

describe('gotifyUtils', () => {
    it('notifies about available updates', async () => {
        try {
            await gotifyUtils.notifyUpdatesAvailable(softwareStub);
        } catch {
            assert.fail(error);
            done();
        }
    });
});
