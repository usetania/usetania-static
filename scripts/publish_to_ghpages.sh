
#!/bin/sh

DIR=$(dirname "$0")

cd $DIR/..

if [[ $(git status -s) ]]
then
    echo "The working directory is dirty. Please commit any pending changes."
    exit 1;
fi

echo "Setup new remote repository"
git config --global user.email "$GITHUB_EMAIL"
git config --global user.name "$GITHUB_USERNAME"
git remote add origin-pages https://${GITHUB_TOKEN}@github.com/Tanibox/usetania-static.git > /dev/null 2>&1
git fetch origin-pages

echo "Deleting old publication"
rm -rf public
mkdir public
git worktree prune
rm -rf .git/worktrees/public/

echo "Checking out gh-pages branch into public"
git worktree add -B gh-pages public origin-pages/gh-pages

echo "Removing existing files"
rm -rf public/*

echo "Generating site"
hugo

echo "Updating gh-pages branch"
cd public
echo "usetania.org" > CNAME
git add --all && git commit -m "Publishing to gh-pages (publish.sh)"

echo "Deploying to gh-pages"
git push origin-pages gh-pages
