#!/bin/bash

html_path="`dirname \"$0\"`/html/"
abs_html_path=`realpath ${html_path}`

echo "${abs_html_path}"

docker run -d --rm -v ${abs_html_path}:/usr/share/nginx/html:ro -p 8000:80 --name graphics_nginx nginx
echo "http://localhost:8000"

