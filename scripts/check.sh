#!/usr/bin/env sh

set -eu

if ! command -v docker >/dev/null 2>&1; then
	printf '%s\n' 'Docker is required. Install Docker Engine with the Compose plugin first.' >&2
	exit 1
fi

docker compose --profile tools run --rm node npm ci
docker compose --profile tools run --rm node npm run check
docker compose --profile tools run --rm visual npm run test:storybook
docker compose --profile tools run --rm qa composer install --no-interaction --prefer-dist
docker compose --profile tools run --rm qa composer validate --strict
docker compose --profile tools run --rm qa composer check

