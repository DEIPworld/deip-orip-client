#!/bin/bash
set -e

TAG=$(git log -1 --pretty=%h)
LATEST="latest"

echo "Building deipworld/client image..."
export IMAGE_NAME="deipworld/client:$TAG"
export LATEST_IMAGE_NAME="deipworld/client:$LATEST"
npm install && 
npm run build && 
docker build -t=${IMAGE_NAME} . && 
docker tag ${IMAGE_NAME} ${LATEST_IMAGE_NAME} && 
docker push ${IMAGE_NAME} && 
docker push ${LATEST_IMAGE_NAME}