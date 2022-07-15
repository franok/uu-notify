import * as utils from './util/utility-functions.mjs';
import * as dbUtils from './util/db-utils.mjs';
import * as octokitUtil from './util/octokit-utils.mjs';
import * as gotifyUtils from './util/gotify-utils.mjs';

import { software as softwareDeps } from './config/software-deps.mjs';

async function main() {
    try {
        if (process.env.NODE_ENV) {
            console.info("NODE_ENV=" + process.env.NODE_ENV);
        }
        // await dbUtils.initDb(db);
        // const software = await dbUtils.getAllFromSoftwareUpdates(db);
        
        const oldData = dbUtils.getSoftwareJson();
        const software = await utils.compareLastInfosWithCurrentSoftwareDepsList(oldData, softwareDeps);
        const softwareAndReleaseInformation = await octokitUtil.retrieveLatestReleaseInformation(software);
        const softwareToUpdate = utils.isUpdateAvailable(softwareAndReleaseInformation);
        
        gotifyUtils.notifyUpdatesAvailable(utils.prepareDataForNotification(softwareToUpdate));
        const updatedData = utils.updateData(softwareAndReleaseInformation);
        await dbUtils.updateSoftwareUpdates(updatedData);

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

