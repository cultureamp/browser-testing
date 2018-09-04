#!/bin/bash
set -e
set -o pipefail
set -u

TEST_NAME=${1:-}

export COMPOSE_FILE=docker-compose.yml
export SELENIUM_REMOTE_HOST=selenium-hub

echo "Pulling images"
docker-compose pull

echo "Building images"
docker-compose build

echo "Running tests"
docker-compose down --remove-orphans
docker-compose run --rm test npm run test:integration:docker

#Stop and remove containers, networks, images, and volumes
echo "Stop all containers"
docker-compose down --remove-orphans
