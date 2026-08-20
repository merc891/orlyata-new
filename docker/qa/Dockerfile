FROM php:8.3-cli

RUN set -eux; \
    apt-get update; \
    apt-get install --yes --no-install-recommends git unzip; \
    rm -rf /var/lib/apt/lists/*

COPY --from=composer:2.10.2 /usr/bin/composer /usr/local/bin/composer

