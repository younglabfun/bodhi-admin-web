#!/bin/sh
echo "stop web service ..."
docker-compose down
echo "start web service ..."
docker-compose up -d

echo "start web service finished !!!"
