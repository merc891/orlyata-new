#!/usr/bin/env sh

set -eu

if ! command -v docker >/dev/null 2>&1; then
	printf '%s\n' 'Docker is required. Install Docker Engine with the Compose plugin first.' >&2
	exit 1
fi

if [ ! -f .env ]; then
	printf '%s\n' 'Create .env from .env.example before setup.' >&2
	exit 1
fi

set -a
# shellcheck disable=SC1091
. ./.env
set +a

docker compose up --detach db mailpit wordpress
docker compose exec --user root wordpress chown www-data:www-data /var/www/html/wp-content/uploads

if ! docker compose --profile tools run --rm wp-cli wp core is-installed >/dev/null 2>&1; then
	docker compose --profile tools run --rm wp-cli wp core install \
		--url="$WP_URL" \
		--title="$WP_TITLE" \
		--admin_user="$WP_ADMIN_USER" \
		--admin_password="$WP_ADMIN_PASSWORD" \
		--admin_email="$WP_ADMIN_EMAIL" \
		--locale=ru_RU \
		--skip-email
fi

docker compose --profile tools run --rm wp-cli wp language core install ru_RU --activate
docker compose --profile tools run --rm wp-cli wp theme activate orlyata

printf 'WordPress: %s\n' "$WP_URL"
printf 'Mailpit (loopback): http://localhost:%s/mailpit/\n' "${MAILPIT_PORT:-8025}"

