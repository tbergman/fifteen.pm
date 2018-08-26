#!/bin/sh

set -x
set -e

rm -rf "public/assets/releases/$2";
aws --profile $1 s3 rm "s3://assets.globally.ltd/$2";
