#!/bin/sh

set -x
set -e

scripts/destroy-local-assets.sh $1
scripts/download-assets.sh $1
