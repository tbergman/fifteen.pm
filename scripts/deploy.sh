 scripts/deploy.sh#!/bin/sh

set -x
set -e

if [ -z "$3" ]; then 
  profile_arg=""
else 
  profile_arg="--profile $3"
fi

# # build the app
CI=false yarn build
# # gzip all assets that aren't movies
cd dist/ && find . -type f ! -path '*.mp4*' ! -path '*.webm*' -exec gzip -9 "{}" \; -exec mv "{}.gz" "{}" \;
cd ../
# push gzipped assets 
aws $profile_arg s3 sync dist/ $1 --exclude '*.mp4*' --exclude '*.webm*' --acl public-read --content-encoding gzip
# push non-gzipped assets
aws $profile_arg s3 sync dist/ $1 --include '*.mp4*' --include '*.webm*' --acl public-read
# refresh cloudfront
aws cloudfront create-invalidation --distribution-id $2 --paths '/*' > /dev/null
