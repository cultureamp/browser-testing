#!/bin/bash
set -e
set -o pipefail
set -u

echo "Pulling images"
docker-compose pull

echo "Building images"
docker-compose build

echo "Running tests"
docker-compose down --remove-orphans
docker-compose run --rm test yarn lint

echo "Stop all containers"
docker-compose down --remove-orphans
