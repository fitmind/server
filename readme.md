# Fitmind server

[![Build Status](https://travis-ci.org/fitmind/server.svg?branch=master)](https://travis-ci.org/fitmind/server)

## Check Swagger UI

Here you will be able to see the API documentation

Run serve locally

```bash
yarn serve:static
```

- On the command you should have a local URL which will serve static files
- click on swagger.html

## You will have to generate a .env files to run the MongoDB Databases, PORT, etc..

| There is an example of an .env file in ./.env.example, MLAB is a great place for getting a free mongoDB database, and example of the env file:

```
PORT=9999
MONGO_URL=mongodb://<user>:<password>@ds245170.mlab.com:45170/testing
NODE_ENV=development
```

## Building

The app requires Babel with the typescript plugin - some good references on how this was done and why are here:

- https://iamturns.com/typescript-babel/
- https://github.com/Microsoft/TypeScript-Babel-Starter

this will generate the necessary ES5 files along with performing the type checking

```bash
yarn build
```

## Running on Dev Mode

All the files changed inside src/\*\*.ts will trigger a rebuild except the tests files

```bash
yarn dev
```

In case you are not using an IDE you will have to run a type checker in the background to know when you have errors

```bash
yarn type-check:watch
```

### Running tests

```bash
yarn test
```

With coverage

```bash
yarn test -- --coverage
```

With on watch mode

```bash
yarn test:watch -- --coverage
```

| Highly recommend running prettier when you perform changes in order to format the code

### Prettier format all

```bash
yarn prettier:all
```

### Prettier on watch mode

```bash
yarn prettier:watch
```

### Prettier check if needs formatting

```bash
yarn prettier:check
```

### Running lint check

```bash
yarn lint
```

### Running lint fix

```bash
yarn lint:fix
```
