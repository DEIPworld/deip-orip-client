#!/bin/bash

set -e

TAG=$(git log -1 --pretty=%h)
LATEST="latest"

echo "Build deip client"
export IMAGE_NAME="deipworld/client:$TAG"
npm install && npm run build

docker build -t=${IMAGE_NAME} .
docker push "deipworld/client:$TAG"