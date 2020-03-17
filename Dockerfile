FROM node:10

RUN mkdir -p /var/app
COPY . /var/app
WORKDIR /var/app

RUN npm install && npm run build
EXPOSE 80

CMD [ "node", "server" ]