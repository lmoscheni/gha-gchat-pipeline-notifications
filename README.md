GitHub Action Google Chat Pipeline Notifications
===
# Set up
Install npm dependencies with:
```
npm install
```
# Build
First at all you need install globally vercel/ncc to generate a distribution file, for this run:
```
npm i -g @vercel/ncc
```
And the you can build with:
```
npm run build
```
# New version
Always you want to generate a new version you need commit your changes and then create a tag and push the changes.
Something like this:
```
git tag -a -m "My first action release" <your numerico standard version>
git push --follow-tags
```
# Use
For use thiis action you need to adding as a job step like this:
```yml
on: [push]

jobs:
  hello_world_job:
    runs-on: ubuntu
    name: A job notify a running pipeline
    steps:
      - name: Notify running pipeline
        id: running
        uses: lmoscheni/gha-gchat-pipeline-notifications@[version]
        with:
          webHookURL: http://www.yourawesomeurl.com
          env: Beta
          version: YourAwesomeVersion
          status: RUNNING
```