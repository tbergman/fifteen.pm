#!/bin/sh

# usage: dual-fisheye-to-equirectangular.sh {input} {output}

set -x
set -e

ffmpeg -i $1 \
       -i scripts/xmap_samsung_gear_2560x1280.pgm \
       -i scripts/ymap_samsung_gear_2560x1280.pgm \
       -lavfi remap \
       $2
