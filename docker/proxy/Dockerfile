FROM nginx:1.28.0-alpine

RUN apk add --no-cache apache2-utils

COPY entrypoint.sh /usr/local/bin/orlyata-proxy-entrypoint
COPY nginx.bootstrap.conf /etc/nginx/orlyata-bootstrap.conf
COPY nginx.https.conf /etc/nginx/orlyata-https.conf

RUN chmod 0755 /usr/local/bin/orlyata-proxy-entrypoint

ENTRYPOINT ["/usr/local/bin/orlyata-proxy-entrypoint"]
