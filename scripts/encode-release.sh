#!/bin/sh

set -x
set -e

# echo "creating public/assets/$2.ogg ... "
# ffmpeg -i "$1"  -acodec libvorbis public/assets/$2.ogg
echo "creating public/assets/$2.mp3 ... "
lame "$1" "public/assets/$2.mp3" -b 320