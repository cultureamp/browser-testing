#!/bin/bash
set -e
set -o pipefail
set -u

TEST_TYPE=${TEST_TYPE:-'functional'}
echo "Running $TEST_TYPE tests"

if [ "$TEST_TYPE" == 'visual' ]; then
    source bin/visualTestingEnv.sh
fi

export COMPOSE_FILE=docker-compose.yml
export SELENIUM_REMOTE_HOST=selenium-hub

echo "Pulling images"
docker-compose pull

echo "Building images"
docker-compose build

echo "Running tests"
docker-compose down --remove-orphans
docker-compose run --rm test \
    /bin/bash -c "DOCKER=true node_modules/webdriverio/bin/wdio ./config/wdio/wdio.$TEST_TYPE.conf.js"

echo "Stop all containers"
docker-compose down --remove-orphans
