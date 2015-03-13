amder
===

Simply AMD loader for Node

## Installation

```sh
$ npm install amder
```

## Usage

```js
require('amder');

// Load AMD module
var x = require('amd-module');

// Do whatever you want
....

```

## API

### config(options)

加载器配置，目前只支持`baseUrl`与`packages`的配置

* **options** `{Object}` 配置项
    * **baseUrl** `{string=}` 模块的基地址
    * **packages** `{Object=}` 第三方包信息
