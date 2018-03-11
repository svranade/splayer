
## SPlayer 
[![Travis](https://img.shields.io/travis/wyhaya/splayer.svg?style=flat-square)](https://travis-ci.org/wyhaya/splayer) [![npm](https://img.shields.io/npm/dt/splayer.svg?style=flat-square)](https://www.npmjs.com/package/splayer) [![npm](https://img.shields.io/npm/l/splayer.svg?style=flat-square)](./LICENSE) [![npm](https://img.shields.io/npm/v/splayer.svg?style=flat-square)](https://www.npmjs.com/package/splayer)

## Introduction

SPlayer is a HTML5 player, using typescript development, only need to initialize an instance can use, at the same time we provide some simple API for you to use.

[View Demo](http://xxx.xxx)

## Install

```bash
npm install splayer
```

```javascript
import SPlayer from 'splayer'
```
or
```html
<link rel="stylesheet" href="splayer.min.css">
```
```html
<script src="splayer.min.js"></script>
```

## API
### Quick Start
One of the simplest examples
```javascript
let splayer = new SPlayer({
    el: '#video',
    src: 'http://oycxw1578.bkt.clouddn.com/test2.mp4',
    poster: 'http://oycxw1578.bkt.clouddn.com/test.jpg'
})
```
### Function
#### play
```javascript
splayer.play()
```
#### pause
```javascript
splayer.pause()
```
#### load
```javascript
splayer.load('http://xx.xx/xx.mp4')
```
#### getFarme
```javascript
splayer.getFarme(12).then(imgURL => {
    console.log(imgURL)
})
// This method can return to a frame of a certain period of time
```
## License
[MIT](./LICENSE) license

