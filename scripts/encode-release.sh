#!/bin/sh

# usage: encode-release.sh {input} {mp3-bitrate} {slug}

set -x
set -e

# echo "creating public/assets/$3.ogg ... "
# ffmpeg -i "$1"  -acodec libvorbis public/assets/$3.ogg
echo "creating public/assets/$3.mp3 ... "
lame "$1" "public/assets/$3.mp3" -b $2
