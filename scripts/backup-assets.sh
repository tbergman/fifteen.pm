#!/bin/sh

set -x
set -e

ISO_TIMESTAMP=`date -u +"%Y-%m-%dT%H:%M:%SZ"`
BACKUP_PATH="s3://backups.assets.globally.ltd/$ISO_TIMESTAMP"
echo "Backing up assets to $BACKUP_PATH"

aws --profile $1 s3 sync s3://assets.globally.ltd/ ${BACKUP_PATH}  --acl public-read
aws --profile $1 cloudfront create-invalidation --distribution-id E2CO6ZKFCFUALS --paths '/*' > /dev/null
