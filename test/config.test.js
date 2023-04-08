const fs = require('fs');
const path = require('path');
const fileURLToPath = require('url');

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../config/config.json")));

test('config is correct', () => {
    expect(config).toBeDefined();
    expect(config.gotify).toBeDefined();
    expect(config.gotify.url).toBeDefined();
    expect(config.gotify.url).toBeDefined();
    expect(config.gotify.token).toBeDefined();

    expect(config.github).toBeDefined();
    expect(config.github.personalAccessToken).toBeDefined();
});
