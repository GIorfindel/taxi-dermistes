# Gestion de taxis

## Requirements
npm version 4.5.0

## Install
Go to the root folder and run :
```shell
cd taxi-dermistes-common
npm link
cd ../taxi-dermistes-core
npm install
cd ../taxi-dermistes-web
npm install
npm run build
cd ../taxi-dermistes-desktop
npm install
```

## Execute
```shell
cd taxi-dermistes-core
npm start
```
If you want a web access:
```shell
cd taxi-dermistes-web
npm start
```
Then go to that [url](http://localhost:3001/) in a browser.

If you want a desktop access
```shell
cd taxi-dermistes-desktop
npm start
```

## Modify
After modifying files in taxi-dermistes-web :
```shell
npm run build
```

## Autocomplete address
If you have an API key for google maps and want to enable autocomplete address form :
+ Uncomment the line importing maps API in  taxi-dermistes/taxi-dermistes-web/src/resource/templates/layout.njk file
+ Replace "yourKey" by your API key
+ Uncomment the initialize function and the google maps event listener in the   taxi-dermistes/taxi-dermistes-web/src/js/course.js
 file
+ Do a build of taxi-dermistes-web


###### by C and F
