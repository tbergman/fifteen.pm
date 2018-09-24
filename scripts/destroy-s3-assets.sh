#!/bin/sh

set -x
set -e


read -p "Are you sure you want to delete all the assets from S3? [y/n] " -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
   aws --profile $1 s3 rm --recursive s3://assets.globally.ltd/
fi


