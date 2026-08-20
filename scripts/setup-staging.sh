#!/usr/bin/env sh

set -eu

if [ ! -f .env ]; then
	printf '%s\n' 'Create .env from .env.example before setup.' >&2
	exit 1
fi

set -a
# shellcheck disable=SC1091
. ./.env
set +a

require_secret() {
	secret_name="$1"
	secret_value="$2"

	case "$secret_value" in
		''|change-this-*)
			printf '%s\n' "Set a strong $secret_name value in .env before publishing staging." >&2
			exit 1
			;;
	esac
}

require_secret 'WP_ADMIN_PASSWORD' "$WP_ADMIN_PASSWORD"
require_secret 'MYSQL_PASSWORD' "$MYSQL_PASSWORD"
require_secret 'MYSQL_ROOT_PASSWORD' "$MYSQL_ROOT_PASSWORD"
require_secret 'STAGING_AUTH_PASSWORD' "$STAGING_AUTH_PASSWORD"

./scripts/setup-wordpress.sh

docker compose --profile tools run --rm node npm ci
docker compose --profile tools run --rm node npm run build:storybook

docker compose up --detach --build proxy

if ! docker compose exec proxy test -f /etc/letsencrypt/live/89.125.120.78/fullchain.pem; then
	docker compose --profile staging run --rm --entrypoint certbot certbot certonly \
		--preferred-profile shortlived \
		--webroot \
		--webroot-path /var/www/certbot \
		--ip-address 89.125.120.78 \
		--email "$WP_ADMIN_EMAIL" \
		--agree-tos \
		--non-interactive \
		--no-eff-email
	docker compose restart proxy
fi

docker compose --profile staging up --detach certbot

printf '%s\n' 'Staging: https://89.125.120.78/'
printf '%s\n' 'WordPress admin: https://89.125.120.78/wp-admin/'
printf '%s\n' 'Mailpit: https://89.125.120.78/mailpit/'
printf '%s\n' 'Mailpit Basic Auth credentials are stored in STAGING_AUTH_USER and STAGING_AUTH_PASSWORD in .env.'
