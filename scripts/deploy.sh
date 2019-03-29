#!/bin/sh

set -x
set -e

# # build the app
yarn build
# # gzip all assets that aren't movies
cd build/ && find . -type f ! -path '*.mp4*' ! -path '*.webm*' -exec gzip -9 "{}" \; -exec mv "{}.gz" "{}" \;
cd ../
# push gzipped assets 
aws s3 sync build/ $1 --exclude '*.mp4*' --exclude '*.webm*' --acl public-read --content-encoding gzip
# push non-gzipped assets
aws s3 sync build/ $1 --include '*.mp4*' --include '*.webm*' --acl public-read
# refresh cloudfront
aws cloudfront create-invalidation --distribution-id $2 --paths '/*' > /dev/null
