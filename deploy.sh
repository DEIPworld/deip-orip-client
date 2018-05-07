#!/bin/bash

npm run build-dev --prefix deip-rpc && npm run build && docker-compose up deip-client