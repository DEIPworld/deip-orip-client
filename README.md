# deip-client-project

> A DEIP client project

## Build Setup

``` bash
# cloning of project
git clone --recursive https://gitlab.com/DEIP/deip-client.git
# or
git clone https://gitlab.com/DEIP/deip-client.git
cd deip-client
git submodule init
git submodule update

# build submodule (from deip-rpc dir)
npm install
npm run build-dev / npm run build-prod

# install dependencies (from root)
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
