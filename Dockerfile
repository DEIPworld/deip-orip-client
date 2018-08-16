FROM kyma/docker-nginx
COPY ngnix/nginx.app.conf /etc/nginx/sites-enabled/default
COPY dist/ /var/www
CMD 'nginx'