#!/bin/sh

set -x
set -e


node scripts/build.js
aws --profile $1 s3 sync build/ $2 --acl public-read
aws --profile $1 cloudfront create-invalidation --distribution-id $3 --paths '/*' > /dev/null
