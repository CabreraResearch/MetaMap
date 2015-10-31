[![Stories in Ready](https://badge.waffle.io/CabreraResearch/MetaMap.png?label=ready&title=Ready)](https://waffle.io/CabreraResearch/MetaMap)
[![bitHound Score](https://www.bithound.io/projects/badges/36fa6ec0-7ddb-11e5-aabb-393b598b5c14/score.svg)](https://www.bithound.io/github/CabreraResearch/MetaMap)
[![bitHound Dependencies](https://www.bithound.io/projects/badges/36fa6ec0-7ddb-11e5-aabb-393b598b5c14/dependencies.svg)](https://www.bithound.io/github/CabreraResearch/MetaMap/master/dependencies/npm)

# MetaMap

## Objectives

# Client codebase

## Style

Assume the following style: ES6/ES7

...with the notes below:

* camelCase variable naming
    * assignment using `let`
* UPPER_CASE constant naming
    * assignment using `const`
* argument-grouping paren style, not function-grouping style
* TBD: operators
* Idioms, see e.g. http://arcturo.github.io/library/coffeescript/04_idioms.html
    * TBD: Underscore vs. comprehensions
        * Underscore provides well known idioms for collection processing vs. bespoke comprehension, however
          simple `map`, `select`/`filter`/`reject` are very straightforward in vanilla cs
    * use `arr[..]` to copy an array, vs. js `slice(0)`
    * TBD: avoiding implicit `for` comprehension return
        * trailing for loop statements will result in aggregation of loop results; in most cases this is not
          desired and can in theory impact performance; explicit return is required to avoid this implicit
          aggregation

# Client development setup

## Install global pre-requisites

1. `install node.js and npm`
2. `npm install -g babel bower gulp riot tsd wiredep`
3. Optional: `npm install -g dev-documentation firebase-tools ncu rimraf wt yo`
    * firebase-tools: allows deployment of the app to the server by `gulp deploy --message="My deploy comment"`
      * also provides its own web server. Run `firebase serve` to launch a local web server on :5000.
    * dev-documentation: generates documentation from JsDoc commented code
    * ncu: checks for updates to all packages
    * rimraf: quickly `sudo rm -f` delete an entire directory quickly (useful when nuking /node_modules/)

## Install project dependencies

1. `npm install`
2. `bower install`
3. `tsd install`
    * installs all DefinitelyTyped definitions to provide Intellisense in VS Code, Atom or Sublime

## Initial client build

1. Generate vendor asset:

        gulp vendor

2. Compile client:

        gulp compile-all

3. Rebuild client (JS only) automatically as changes are made:

        gulp watch

    * Must have [LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) extension installed

## Run a dev server

1. (With python) `python -m SimpleHTTPServer`
    * All API calls are served through Firebase, there is no backend to configure
1. (With Firebase) `firebase serve`
2. open `http://localhost:8080/dev.html` in a browser
    * index.html is the default page, but it is often difficult to get around caching--so use dev.html for local development/testing

## Rebuild client

* To rebuild JS only: `gulp compile`
* To rebuild everything: `gulp compile-all`

## Running tests

TDB

### (Re)build and run unit tests

1. `gulp <test task>`
2. `gulp <future test command>`