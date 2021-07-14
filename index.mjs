import * as utils from './util/utility-functions.mjs';
import * as dbUtils from './util/db-utils.mjs';
import * as octokitUtil from './util/octokit-utils.mjs';
import * as gotifyUtils from './util/gotify-utils.mjs';

async function main() {
    try {
        if (process.env.NODE_ENV) {
            console.info("NODE_ENV=" + process.env.NODE_ENV);
        }
        const db = await dbUtils.openDb();
        await dbUtils.initDb(db);
        const software = await dbUtils.getAllFromSoftwareUpdates(db);
        const softwareAndReleaseInformation = await octokitUtil.retrieveLatestReleaseInformation(software);
        const softwareToUpdate = utils.isUpdateAvailable(softwareAndReleaseInformation);
        const updatedData = utils.updateData(softwareToUpdate);
        gotifyUtils.notifyUpdatesAvailable(updatedData);
        await dbUtils.updateSoftwareUpdates(db, updatedData);
        dbUtils.closeDb(db);
        console.log("Script finished.");
    } catch (err) {
        console.error("Error occurred. Details:");
        if (err.name === "HttpError") {
            console.log(`${err.name} ${err.status}: '${err.message}'.`);
            if (err.custom !== undefined && err.custom.component === "github-api") {
                await gotifyUtils.notifyGithubApiError(err);
            }
        } else {
            console.log(err);
            await gotifyUtils.notifyGenericError(err);
        }
        console.error("Failure! Exiting!");
    }
}

main();

