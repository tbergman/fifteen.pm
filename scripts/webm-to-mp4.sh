#!/bin/sh

# usage: dual-fisheye-to-equirectangular.sh {input} {output}

set -x
set -e

input="$1"
output=`echo "${input//webm/mp4}"`

ffmpeg -i $input $output
