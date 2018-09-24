#!/bin/sh

set -x
set -e


scripts/destroy-s3-assets.sh $1;
scripts/upload-assets.sh $1;
