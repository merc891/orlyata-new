#!/bin/sh

set -eu

: "${STAGING_AUTH_USER:?STAGING_AUTH_USER is required}"
: "${STAGING_AUTH_PASSWORD:?STAGING_AUTH_PASSWORD is required}"

printf '%s\n' "$STAGING_AUTH_PASSWORD" \
	| htpasswd -iBc /etc/nginx/.htpasswd "$STAGING_AUTH_USER"

if [ -f /etc/letsencrypt/live/89.125.120.78/fullchain.pem ]; then
	cp /etc/nginx/orlyata-https.conf /etc/nginx/conf.d/default.conf
else
	cp /etc/nginx/orlyata-bootstrap.conf /etc/nginx/conf.d/default.conf
fi

(
	while sleep 21600; do
		if [ -f /etc/letsencrypt/live/89.125.120.78/fullchain.pem ]; then
			nginx -s reload
		fi
	done
) &

exec nginx -g 'daemon off;'
