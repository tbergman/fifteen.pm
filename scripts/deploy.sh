#!/bin/sh

set -x
set -e


rm -rf tmp/;
rm -rf build/;
NODE_ENV='production' && node scripts/build.js
rm -rf build/assets/releases/;
mkdir -p tmp
cp -R build/ tmp
aws --profile $1 s3 sync tmp/ $2 --acl public-read
sh scripts/upload-assets.sh $1
rm -rf tmp
aws --profile $1 cloudfront create-invalidation --distribution-id $3 --paths '/*' > /dev/null
