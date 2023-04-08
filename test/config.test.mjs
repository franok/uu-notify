import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { expect, should } from 'chai';

import { software as swDeps } from '../config/software-deps.mjs';

let config;

before(() => {
    should(); // init chai.should

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    fs.copyFileSync(path.resolve(__dirname, "../config/config.json.template"), path.resolve(__dirname, "test-config.json"));
    config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "test-config.json")));
});


describe('Config', () => {
    it('is valid', () => {
        expect(config).to.have.property('gotify');
        // config.should.have.property('gotify');
        expect(config.gotify).to.have.property('url');
        expect(config.gotify).to.have.property('token');

        expect(config).to.have.property('github');
        expect(config.github).to.have.property('personalAccessToken');
    });
});

describe('SoftwareDeps', () => {
    it('are valid', () => {
        swDeps.forEach(dep => {
            expect(dep).to.have.property('name');
            expect(dep).to.have.property('feedUrl');
            expect(dep).to.have.property('github');
            expect(dep.github).to.have.property('org');
            expect(dep.github).to.have.property('repo');
        });
    });
});

after(() => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    fs.unlinkSync(path.resolve(__dirname, "test-config.json"));
});
