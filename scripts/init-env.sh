#!/usr/bin/env sh

set -eu

if [ -e .env ]; then
	printf '%s\n' '.env already exists; no changes were made.' >&2
	exit 1
fi

cp .env.example .env
sed -i "s/^LOCAL_UID=.*/LOCAL_UID=$(id -u)/" .env
sed -i "s/^LOCAL_GID=.*/LOCAL_GID=$(id -g)/" .env
chmod 0600 .env

printf '%s\n' 'Created .env. Replace all change-this-* passwords before starting WordPress.'

