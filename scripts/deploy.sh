#!/usr/bin/env bash
set -e

yarn build

git config --global user.email wang48372162@gmail.com
git config --global user.name wang48372162

mkdir -p ~/.ssh
chmod 600 ~/.ssh
ssh-keyscan github.com >> ~/.ssh/known_hosts

gh-pages -t -d dist -m "Update [ci skip]" -r git@github.com:wang48372162/ycsaudio.git
