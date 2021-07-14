import Parser from 'rss-parser';
import * as utils from './utility-functions.mjs';

const parser = new Parser();

export async function retrieveFeed(aSoftware) {
    return await utils.mapAsync(aSoftware, async (sw) => ({
        ...sw,
        feed: await parser.parseURL(sw.feedUrl)
    }));
}