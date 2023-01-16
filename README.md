# NodeJS/Typescript CLI Boilerplate

This template is designed to avoid rewriting the core of a CLI every time I want to create a new script.

## Setup

To get started, go into the package.json file in this repo and add a command or commands to the `bin` section:

```json
{
  "name": "ts-boilerplate",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "tsc"
  },
  "bin": {
    == Add Command Here ==
    "example": "./dist/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "commander": "^9.4.1"
  }
}
```

