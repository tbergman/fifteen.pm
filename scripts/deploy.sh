#!/bin/sh

set -x
set -e

# # build the app
node scripts/build.js
# # gzip all assets that aren't movies
cd build/ && find . -type f ! -path '*.mp4*' ! -path '*.webm*' -exec gzip -9 "{}" \; -exec mv "{}.gz" "{}" \;
cd ../
# push gzipped assets 
aws --profile $1 s3 sync build/ $2 --exclude '*.mp4*' --exclude '*.webm*' --acl public-read --content-encoding gzip
# push non-gzipped assets
aws --profile $1 s3 sync build/ $2 --include '*.mp4*' --include '*.webm*' --acl public-read
# refresh cloudfront
aws --profile $1 cloudfront create-invalidation --distribution-id $3 --paths '/*' > /dev/null
