#!/bin/bash

VERSION=$(cat src/index.ts | perl -pe '($_)=/([0-9]+([.][0-9]+)+)/')
git tag -d v$VERSION 2>/dev/null
git tag -a v$VERSION -m $VERSION
echo "Tagged version $VERSION (from src/index.ts)"
