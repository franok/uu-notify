#!/bin/bash
echo "--- uuNotify setup ---"
echo "Existing files in config/ will not be overwritten."
echo ""

echo "Running 'npm clean-install' ..."
npm ci # clean-install
echo "Done."
echo ""

echo "Copy configuration files..."
cd config/

CONFIG_JSON="config.json"
SW_DEPS="software-deps.mjs"

if [ -f "$CONFIG_JSON" ]; then
    echo "$CONFIG_JSON already exists. Skipping..."
else 
    echo "Creating $CONFIG_JSON from ${CONFIG_JSON}.template ..."
    cp "${CONFIG_JSON}.template" $CONFIG_JSON
    echo "Done."
fi

if [ -f "$SW_DEPS" ]; then
    echo "$SW_DEPS already exists. Skipping..."
else 
    echo "Creating $SW_DEPS from ${SW_DEPS}.example ..."
    cp "${SW_DEPS}.example" $SW_DEPS
    echo "Done."
fi

echo ""
echo "--- COMPLETED uuNotify setup ---"
echo "If this was the first time you executed this script, please configure config/$CONFIG_JSON and config/$SW_DEPS now!"
