#!/bin/sh

# usage: dual-fisheye-to-equirectangular.sh {input} {output}

set -x
set -e

input="$1"
output=`echo "${input//mp4/webm}"`

ffmpeg -i $input -c:v libvpx -crf 10 -b:v 1M -c:a libvorbis $output
