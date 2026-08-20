FROM wordpress:7.0.2-php8.3-apache

RUN set -eux; \
    apt-get update; \
    apt-get install --yes --no-install-recommends msmtp; \
    rm -rf /var/lib/apt/lists/*

COPY php.ini /usr/local/etc/php/conf.d/orlyata.ini
COPY msmtprc /etc/msmtprc

RUN chmod 0644 /etc/msmtprc

