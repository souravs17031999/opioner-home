#!/usr/bin/env bash
set -e 

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
    echo "Warning: DOCKER_HUB_USERNAME empty, pushing with CI secrets DOCKER_HUB_USERNAME: ${DOCKER_HUB_USERNAME}"
fi

if [[ -z ${TAGNAME} ]]; then
    TAGNAME=${GITHUB_CI_TAG}
    echo "Warning: TAGNAME empty, pushing with CI tag: ${TAGNAME}"
fi

docker tag opioner-home_opioner_home:latest ${DOCKER_HUB_USERNAME}/opioner-home_opioner_home:$TAGNAME
docker push ${DOCKER_HUB_USERNAME}/opioner-home_opioner_home:$TAGNAME
echo "==================================*********==================================="