#!/bin/bash
set -e

TAG=$(git log -1 --pretty=%h)
LATEST="latest"

echo "Building deipworld/nsf-transparency-demo-web-client image..."
export IMAGE_NAME="deipworld/nsf-transparency-demo-web-client:$TAG"
export LATEST_IMAGE_NAME="deipworld/nsf-transparency-demo-web-client:$LATEST"

docker build -t=${IMAGE_NAME} . && 
docker tag ${IMAGE_NAME} ${LATEST_IMAGE_NAME} && 
docker push ${IMAGE_NAME} && 
docker push ${LATEST_IMAGE_NAME}