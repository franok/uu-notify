import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import * as utils from './utility-functions.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gotify = JSON.parse(readFileSync(path.resolve(__dirname, "../config/config.json"))).gotify;


async function sendGotification(content, prio = 5) {
    if (!gotify.url) {
        throw new Error("gotify url missing");
    }
    if (!gotify.token) {
        throw new Error("gotify token missing");
    }
    if (!content.message) {
        throw new Error("gotify message not defined");
    }
    if (!content.title) {
        throw new Error("gotify title not defined");
    }

    const requestBody = {
        "title": content.title,
        "message": content.message,
        "priority": prio,
        "extras": {
            "client::notification": {
                "click": {
                    "url": content.url
                }
            }
        }
    };

    return await fetch(gotify.url + '/message?token=' + gotify.token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    })
}

export function notifyUpdatesAvailable(softwareToBeUpdated) {
    utils.mapAsync(softwareToBeUpdated, async (sw) => {
        const priority = undefined; //must be undefined to fallback to default
        if (sw.somethingImportant) {
            priority = 7;
        }

        sendGotification({
            title: `Uberspace: ${sw.name}`,
            message: `Update available ⬆️\nCurrent version: <=${sw.oldVersion}\nLatest version: ${sw.softwareVersion}`,
            url: sw.releaseUrl
        }, priority);
    });
}

export async function notifyGithubApiError(err) {
    let rateLimitResetInfo;
    if (err.headers["x-ratelimit-reset"]) {
        let rateLimitReset = new Date(0);
        rateLimitReset.setUTCSeconds(parseInt(err.headers["x-ratelimit-reset"], 10))
        rateLimitResetInfo = `\nRate limit will be reset at ${rateLimitReset.toISOString()}.`;
    }
    await sendGotification({
        title: "HTTP " + err.status + ": GitHub API",
        message: `${err.message.replace(/\(.*\)/, "")}${rateLimitResetInfo}`
    }, 9);
}

export async function notifyGenericError(err) {
    await sendGotification({
        title: "Error: uuNotify",
        message: `${err.message}`
    }, 9);
}