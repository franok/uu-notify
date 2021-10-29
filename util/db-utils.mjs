import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
// import SQL from 'sql-template-strings';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { software } from '../config/software-deps.mjs';

sqlite3.verbose();

/*****************************************/
//table feed_updates
const tableSoftwareUpdates = "software_updates";
//columns of table feed_updates
const softwareName = "software_name";
const feedUrl = "feed_url";
const githubOrg = "gh_org";
const githubRepo = "gh_repo";
const softwareVersion = "software_version";
const lastUpdated = "last_updated";


//other table
//columns of other table
/*****************************************/


//exports
export async function openDb() {
    return await open({
        filename: __dirname + '/../' + 'uberspace-software-updates.sqlite3',
        driver: sqlite3.Database
    })
}

export async function closeDb(db) {
    await db.close();
}

export async function initDb(db) {
    await db.exec(`CREATE TABLE IF NOT EXISTS ${tableSoftwareUpdates} (
        ${softwareName} TEXT PRIMARY KEY NOT NULL,
        ${feedUrl} TEXT NOT NULL,
        ${githubOrg} TEXT,
        ${githubRepo} TEXT,
        ${softwareVersion} TEXT,
        ${lastUpdated} TEXT)`);

    const existingRecords = await db.all(`SELECT ${softwareName} as softwareName FROM ${tableSoftwareUpdates}`);
    const softwareInDB = existingRecords.map(r => r.softwareName);
    const newSoftware = software.filter(sw => !softwareInDB.includes(sw.name));

    if (newSoftware.length) { // insert new if software-deps.mjs contains entries not yet in DB
        const stmt = await db.prepare(`INSERT INTO ${tableSoftwareUpdates} 
            VALUES (@name, @feedUrl, @ghOrg, @ghRepo, @swversion, @lastUpdated)`);

        await Promise.all(newSoftware.map(async sw => {
            await stmt.run({
                '@name': sw.name,
                '@feedUrl': sw.feedUrl,
                '@ghOrg': sw.github.org,
                '@ghRepo': sw.github.repo
            })
        }));
        await stmt.finalize(); //needed here: Every prepared statement must be destroyed using a call to this routine in order to avoid memory leaks
    }

}

export async function getAllFromSoftwareUpdates(db) {
    return db.all(`SELECT rowid AS id, 
    ${softwareName} as softwareName, 
    ${feedUrl} as feedUrl, 
    ${githubOrg} as githubOrg, 
    ${githubRepo} as githubRepo, 
    ${softwareVersion} as softwareVersion, 
    ${lastUpdated} as lastUpdated 
    FROM ${tableSoftwareUpdates}`);
}

export async function updateSoftwareUpdates(db, updates) {
    const stmt = await db.prepare(`UPDATE ${tableSoftwareUpdates} 
        SET ${softwareVersion} = @swversion, 
        ${lastUpdated} = @lastUpdated 
        WHERE ${softwareName} = @name`);

    await Promise.all(updates.map(async sw => {
        const rowsUpdated = await stmt.run({
            '@name': sw.softwareName,
            '@swversion': sw.softwareVersion,
            '@lastUpdated': sw.lastUpdated
        });
        return rowsUpdated;
    }));
    await stmt.finalize(); //needed here: Every prepared statement must be destroyed using a call to this routine in order to avoid memory leaks
}
