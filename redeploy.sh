#!/bin/bash

docker rm deip-client -f && 
docker rmi deipclient_deip-client -f && 
rm -rf dist node_modules && 
npm install && 
npm run build && 
docker-compose up deip-client