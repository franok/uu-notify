import path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "../uberspace-software-updates.json");

//exports
export function getSoftwareJson() {
    if(!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, "[]"); // initialize empty json file
    }
    return JSON.parse(fs.readFileSync(dbPath));
}

export async function updateSoftwareUpdates(updates) {
    fs.writeFileSync(dbPath, JSON.stringify(updates));
}
