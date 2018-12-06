FROM halverneus/static-file-server
ENV PORT=80
COPY ./dist ./web
