#!/usr/bin/env bash
echo "Waiting for Host webapp.... ${CYPRESS_BASE_URL}"
wait-on ${CYPRESS_BASE_URL}
echo "Wait finished ...."

cypress run