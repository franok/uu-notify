const fs = require('fs');
const path = require('path');

let config;

beforeAll(() => {
    fs.copyFileSync(path.resolve(__dirname, "../config/config.json.template"), path.resolve(__dirname, "test-config.json"));
    config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "test-config.json")));
});


test('config is correct', () => {
    expect(config).toBeDefined();
    expect(config.gotify).toBeDefined();
    expect(config.gotify.url).toBeDefined();
    expect(config.gotify.url).toBeDefined();
    expect(config.gotify.token).toBeDefined();

    expect(config.github).toBeDefined();
    expect(config.github.personalAccessToken).toBeDefined();
});

afterAll(() => {
    fs.unlinkSync(path.resolve(__dirname, "test-config.json"));
});