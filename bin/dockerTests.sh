#!/bin/bash
set -e
set -o pipefail
set -u

TEST_TYPE=${TEST_TYPE:-'functional'}
echo "Running $TEST_TYPE tests"

CMD="DOCKER=true yarn test:functional"
if [ "$TEST_TYPE" == 'visual' ]; then
    CMD="DOCKER=true yarn test:visual"
fi

export SELENIUM_REMOTE_HOST=selenium-hub

echo "Pulling images"
docker-compose pull

echo "Building images"
docker-compose build

echo "Running tests"
docker-compose down --remove-orphans
docker-compose run --rm test \
    /bin/bash -c "$CMD"

echo "Stop all containers"
docker-compose down --remove-orphans
