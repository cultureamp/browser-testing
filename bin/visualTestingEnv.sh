#!/bin/bash
set -e
set -o pipefail
set -u

BROWSER=${BROWSER:-}
BUILDKITE=${BUILDKITE:-}
VISUAL_DROID_PASSWORD=${VISUAL_DROID_PASSWORD:-}

PROJECT_NAME='browser-testing'

if [[ -z "$BROWSER" ]]; then
    export PROJECT_NAME="$PROJECT_NAME"
else
    export PROJECT_NAME="${PROJECT_NAME}_cross_browser"
fi
currentbranch=$(git branch)
echo "current brnach -- $currentbranch"

export CURRENT_BRANCH=${BUILDKITE_BRANCH:-$(git rev-parse --abbrev-ref HEAD)}
CURRENT_SHA=$(git rev-parse HEAD)

export BRANCH_SHA=${CURRENT_SHA}
echo "Do compare sha 1"
export COMPARE_SHA=$(git merge-base origin/master "$CURRENT_SHA")
echo "compare sha 1 - $COMPARE_SHA"


if [ "$BUILDKITE" == "true" ] ; then
    export GITHUB_STATUS_TARGET_URL="$BUILDKITE_BUILD_URL#$BUILDKITE_JOB_ID"
    export LAST_COMMIT_SHA=$(git log origin/master.. --pretty=tformat:'%H' | head -n 1)
    export GITHUB_URL="https://api.github.com/repos/cultureamp/murmur/statuses/$LAST_COMMIT_SHA"
fi

if [ -z "$VISUAL_DROID_PASSWORD" ] ; then
    echo "
            Visual droid api is behind a secure end point and needs a password to run.
            Please set the value of VISUAL_DROID_PASSWORD
            To get the password please check LastPass secure notes under visual droid api"
    exit 1
fi

if [[ $(uname) == 'Darwin' ]]; then #For MacOS
    export AUTHORIZATION="Basic $(echo -ne ":$VISUAL_DROID_PASSWORD" | base64 )"
else
    export AUTHORIZATION="Basic $(echo -ne ":$VISUAL_DROID_PASSWORD" | base64 --wrap=0)"
fi

LAST_COMMIT_SHA=${LAST_COMMIT_SHA:-}

echo '--- Debug Output'
echo "Project name   - $PROJECT_NAME"
echo "Branch sha     - $BRANCH_SHA"
echo "Compare sha    - $COMPARE_SHA"
echo "Current branch - $CURRENT_BRANCH"
