#!/bin/sh

set -x
set -e


read -p "Are you sure you want to delete all the local assets from public/assets/releases/? [y/n] " -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
   rm -rf public/assets/releases/*
fi


