# Gestion de taxis

## Requirements
npm version 4.5.0

## Install
Go to the root folder and run :
```shell
cd taxi-dermistes-common
npm link
npm install
cd ../taxi-dermistes-core
npm link taxi-dermistes-common
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
Then go to that [url] (localhost:3001) in a browser.

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

##### by C and F
