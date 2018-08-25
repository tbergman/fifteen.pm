#!/bin/sh

set -x
set -e

aws --profile $1 s3 sync public/assets/releases/ s3://assets.globally.ltd/  --acl public-read
aws --profile $1 cloudfront create-invalidation --distribution-id E2CO6ZKFCFUALS --paths '/*' > /dev/null
