#!/bin/bash

html_path="`dirname \"$0\"`/html/"
echo $html_path

docker run -d --rm -v $html_path:/usr/share/nginx/html:ro -p 8000:80 --name graphics_nginx nginx
echo "http://localhost:8000"

