#!/usr/bin/env bash
set -e 

if [[ -z $WORKSPACE ]]; then 
    TOPDIR=$(git rev-parse --show-toplevel)
    source $TOPDIR/build-scripts/env.sh
else
    source $WORKSPACE/build-scripts/env.sh
fi

echo " Build docker image for opioner frontend app ......"
docker-compose $BUILD_COMPOSE_LIST build

docker-compose $BUILD_COMPOSE_LIST down


