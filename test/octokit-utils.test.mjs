import assert from 'assert';
import * as octokitUtils from '../util/octokit-utils.mjs';

beforeEach(() => {
    // use mock data:
    process.env.NODE_ENV = "development";
});

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

describe('octokitUtils', () => {
    it('retrieve release information', async () => {
        try {
            await octokitUtils.retrieveLatestReleaseInformation(softwareStub);
        } catch (error) {
            assert.fail(error);
            done();
        }
    });
});
