FROM kyma/docker-nginx
COPY nginx/nginx.app.conf /etc/nginx/sites-enabled/default
COPY dist/ /var/www
CMD 'nginx'