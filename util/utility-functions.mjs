export async function mapAsync(arr, asyncCallback) {
    return await Promise.all(arr.map(asyncCallback));
}

export async function compareLastInfosWithCurrentSoftwareDepsList(oldData, softwareDeps) {
    let software = [];
    for (let i = 0; i < softwareDeps.length; i++) {
        let matchingItem = oldData.find(oldSwData => oldSwData.name === softwareDeps[i].name); // undefined, if swDep was removed
        software.push({
            ...softwareDeps[i],
            softwareVersion: matchingItem?.softwareVersion ?? null, // in case swDep doesn't exist anymore, use null-safe accessor
            lastUpdated: matchingItem?.lastUpdated ?? null // in case swDep doesn't exist anymore, use null-safe accessor
        });
    }
    return software;
}

export function isUpdateAvailable(aSoftware) {
    return aSoftware.filter(sw => {
        return sw.lastUpdated !== sw.releaseInformation.published_at;
    });
}

export function prepareDataForNotification(aSoftwareToSendUpdateNotificationsFor) {
    return updateData(aSoftwareToSendUpdateNotificationsFor);
}

export function updateData(aSoftwareToUpdateWithReleaseInfos) {
    return aSoftwareToUpdateWithReleaseInfos.map(sw => ({
        ...sw,
        lastUpdated: sw.releaseInformation.published_at,
        oldVersion: sw.softwareVersion,
        softwareVersion: sw.releaseInformation.tag_name,
        releaseUrl: sw.releaseInformation.html_url,
        preRelease: sw.releaseInformation.prerelease
    }));
}
