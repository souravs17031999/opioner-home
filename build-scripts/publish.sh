#!/usr/bin/env bash

if [[ -z $WORKSPACE ]]; then 
    TOPDIR=$(git rev-parse --show-toplevel)
    source $TOPDIR/build-scripts/env.sh
else
    source $WORKSPACE/build-scripts/env.sh
fi

echo "Publishing to docker hub....."
docker login -u $dockerHubUsername -p $dockerHubPassword

echo "==================================*********==================================="

if [[ -z ${DOCKER_HUB_USERNAME} ]]; then
    DOCKER_HUB_USERNAME="souravkumardevadmin"
fi

if [[ -z ${TAGNAME} ]]; then
    TAGNAME=${GITHUB_CI_TAG}
fi

docker tag opioner-home_opioner_home:latest ${DOCKER_HUB_USERNAME}/opioner-home_opioner_home:$TAGNAME
docker push ${DOCKER_HUB_USERNAME}/opioner-home_opioner_home:$TAGNAME
echo "==================================*********==================================="