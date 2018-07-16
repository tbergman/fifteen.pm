#!/bin/sh

set -x
set -e

/Applications/Chromium.app/Contents/MacOS/Chromium http://localhost:3000/ \
  --disable-features=PreloadMediaEngagementData,AutoplayIgnoreWebAudio,MediaEngagementBypassAutoplayPolicies