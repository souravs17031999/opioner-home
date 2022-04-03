#!/usr/bin/env bash
if [ "${NODE_ENV}" == "developement" ]; then
    export DEBUG="*"
fi
npm run start