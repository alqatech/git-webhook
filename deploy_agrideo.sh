#!/bin/bash

REPO_DIR="/var/www/html/project.git"
WEB_ROOT_DIR="/var/www/html/project.com"

BRANCH="master"

cd "$REPO_DIR"
git fetch
git --work-tree="$WEB_ROOT_DIR" --git-dir="$REPO_DIR" checkout -f

cd "$WEB_ROOT_DIR"
/usr/local/bin/composer install
