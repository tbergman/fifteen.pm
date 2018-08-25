#!/bin/sh

set -x
set -e

aws --profile $1 s3 sync s3://assets.globally.ltd/ public/assets/releases/