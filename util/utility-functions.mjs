export async function mapAsync(arr, asyncCallback) {
    return await Promise.all(arr.map(asyncCallback));
}

export function isUpdateAvailable(aSoftware) {
    return aSoftware.filter(sw => {
        return sw.lastUpdated !== sw.releaseInformation.published_at;
    });
}

export function updateData(aSoftwareToUpdate) {
    return aSoftwareToUpdate.map(sw => ({
        ...sw,
        lastUpdated: sw.releaseInformation.published_at,
        oldVersion: sw.softwareVersion,
        softwareVersion: sw.releaseInformation.tag_name,
        releaseUrl: sw.releaseInformation.html_url,
        preRelease: sw.releaseInformation.prerelease
    }));
}
