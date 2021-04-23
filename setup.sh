#!/bin/sh
set -x
with_base() {
    safe="$(echo $1 | sed 's/\//\\\//g')"
    echo $safe
    curl $1 | sed "s/<head>/<head><base href='$safe' \/>/" > $2
}
curl https://github.com/CosineP > embed/github-CosineP.html
curl https://github.com/CosineGaming > embed/github-CosineGaming.html
with_base https://bugzilla.mozilla.org/user_profile?user_id=497233 embed/bugzilla.html
with_base https://anticapitalist.party/tags/cosic embed/comics.html
