#!/bin/bash

# Script is from - https://stackoverflow.com/questions/34405047/how-do-you-merge-into-another-branch-using-travis-with-git-commands

# ==========
# We need to run this script as we need to find out parent branch (COMPARE_SHA) and branch name. This can only be done if we have origin/master locally
# ==========

# Keep track of where Travis put us.
# We are on a detached head, and we need to be able to go back to it.
local build_head=$(git rev-parse HEAD)

# Fetch all the remote branches. Travis clones with `--depth`, which
# implies `--single-branch`, so we need to overwrite remote.origin.fetch to
# do that.
git config --replace-all remote.origin.fetch +refs/heads/*:refs/remotes/origin/*
git fetch
# optionally, we can also fetch the tags
git fetch --tags

# create the tacking branches
for branch in $(git branch -r|grep -v HEAD) ; do
    git checkout -qf ${branch#origin/}
done

# finally, go back to where we were at the beginning
git checkout ${build_head}
