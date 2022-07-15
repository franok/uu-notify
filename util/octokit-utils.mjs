import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Octokit } from '@octokit/core';
import * as utils from './utility-functions.mjs';
import * as mock from './mock-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const github = JSON.parse(readFileSync(path.resolve(__dirname, "../config/config.json"))).github;

function octokitFactory() {
    if (github.personalAccessToken) {
        return new Octokit({
            auth: github.personalAccessToken,
        });
    } else {
        return new Octokit();
    }
}

const octokit = octokitFactory();

async function getLatestRelease(githubOrg, githubRepo) {
    try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
            owner: githubOrg,
            repo: githubRepo
        });
        return response.data;
    } catch (err) {
        if (err.name === "HttpError") {
            if (err.documentation_url !== undefined && err.documentation_url.includes("github")) {
                err.custom = {
                    component: "github-api",
                    type: err.name
                };
            }
            console.debug(`Error of type '${err.name}' occurred during octokit request.`);
        }
        throw err;
    }
}

export async function retrieveLatestReleaseInformation(aSoftware) {
    return await utils.mapAsync(aSoftware, async (sw) => ({
        ...sw,
        releaseInformation: (process.env.NODE_ENV === "development") ? mock.octokitLatestReleaseResponse()
            : await getLatestRelease(sw.github.org, sw.github.repo)
    }));
}
