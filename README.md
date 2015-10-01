[![Stories in Ready](https://badge.waffle.io/CabreraResearch/MetaMap.png?label=ready&title=Ready)](https://waffle.io/CabreraResearch/MetaMap)
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

## Install pre-requisites

1. `install node.js and npm`
2. `npm install -g babel bower gulp riot tsd wiredep`
3. `tsd install`
    * installs all DefinitelyTyped definitions to provide Intellisense in VS Code, Atom or Sublime
3. Optional: `npm install dev-documentation firebase ncu rimraf wt yo`
    * firebase: allows deployment of the app to the server by `gulp deploy --message="My deploy comment"`
    * dev-documentation: generates documentation from JsDoc commented code
    * ncu: checks for updates to all packages
    * rimraf: quickly `sudo rm -f` delete an entire directory quickly (useful when nuking /node_modules/)

## Install project dependencies

1. `npm install`
2. `bower install`

## Initial client build

1. Generate vendor asset:

        gulp vendor
        
2. Compile client:

        gulp compile
        

3. Rebuild client automatically as changes are made:

        gulp watch
        
    * Must have [LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) extension installed

## Run a dev server
    
1. `python -m SimpleHTTPServer`
    * All API calls are served through Firebase, there is no backend to configure
2. open `http://localhost:8080/index.html` in a browser

## Rebuild client

* To rebuild JS only: `gulp browserify-dev`
* To rebuild everything: `gulp compile`
    
## Running tests

TDB

### (Re)build and run unit tests

1. `gulp <test task>`
2. `gulp <future test command>`
