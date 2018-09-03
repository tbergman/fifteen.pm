#!/bin/sh

# usage: dual-fisheye-to-equirectangular.sh {input} {output}

set -x
set -e

input="$1"
output=`echo "${input//.mp4/-er.mp4}"`

ffmpeg -i $input \
       -i scripts/xmap_samsung_gear_2560x1280.pgm \
       -i scripts/ymap_samsung_gear_2560x1280.pgm \
       -lavfi remap \
       $output
