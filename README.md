# browser-testing
Browser automation library to run visual and functional tests. Both visual and functional can be run in multiple browsers. The browsers that are supported are
- Chrome (default Browser)
- Firefox 
- Safari
- Edge
- Internet Explorer 10 
- Internet Explorer 11


<!-- TOC depthFrom:2 -->

- [Getting Started](#getting-started)
    - [Clone](#clone)
    - [Local Setup](#local-setup)
    - [Run functional test](#run-functional-test)
        - [Locally](#locally)
            - [Chrome](#chrome)
            - [Other Browsers](#other-browsers)
        - [Docker](#docker)
            - [Chrome](#chrome-1)
            - [Other Browsers](#other-browsers-1)
    - [Run visual test](#run-visual-test)
        - [Locally](#locally-1)
            - [Chrome](#chrome-2)
            - [Other Browsers](#other-browsers-2)
        - [Docker](#docker-1)
            - [Chrome](#chrome-3)
            - [Other Browsers](#other-browsers-3)
    - [Run linting](#run-linting)
        - [Locally](#locally-2)
        - [Docker](#docker-2)
    - [Browser env variable](#browser-env-variable)

<!-- /TOC -->

## Getting Started

### Clone
To clone this repo, run these commands
```
mkdir -p ~/code/cultureamp
git clone git@github.com:cultureamp/browser-testing.git ~/code/cultureamp/browser-testing
```

### Local Setup
```
yarn setup
```

### Run functional test

#### Locally
##### Chrome
```
yarn test:functional
```
##### Other Browsers
```
BROWSER=Firefox yarn test:functional
```
#### Docker
##### Chrome
```
yarn test:functional:docker
```
##### Other Browsers
```
BROWSER=IE10 yarn test:functional:docker
```
### Run visual test

#### Locally
##### Chrome
```
yarn test:visual
```
##### Other Browsers
```
BROWSER=Firefox yarn test:visual
```
#### Docker
##### Chrome
```
yarn test:visual:docker
```
##### Other Browsers
```
BROWSER=IE10 yarn test:visual:docker
```
### Run linting

#### Locally
```
yarn lint:local
```

#### Docker
```
yarn lint:docker
```

### Browser env variable
The environment variable browser can have the following values
 - Chrome
 - Firefox
 - Safari
 - Edge
 - IE10
 - IE11