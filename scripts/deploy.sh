#!/bin/sh

set -x
set -e

rm -rf tmp/;
rm -rf build/;
node scripts/build.js
mkdir -p tmp
cp -R build/ tmp
aws --profile $1 s3 sync tmp/ $2 --acl public-read
rm -rf tmp
aws --profile $1 cloudfront create-invalidation --distribution-id $3 --paths '/*' > /dev/null
