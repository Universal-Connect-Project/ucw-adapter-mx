# MX Adapter for the UCW

[![npm version](https://badge.fury.io/js/@ucp-npm%2Fmx-adapter.svg)](https://badge.fury.io/js/@ucp-npm%2Fmx-adapter)

This is the adapter that makes it possible to connect with MX via the Universal Connect Widget.

## Installation

This package is meant to be used with the Universal Connect Widget. If you have forked the UCW project, you can install it as a dependency of the widget.

Navigate to your forked project and, from the root of the project, run:

```bash
npm i @ucp-npm/mx-adapter --workspace apps/server
```

## Usage

Once you have the npm package installed, you can set up the ucw to use it.

In the `./apps/server/adapterSetup.ts` file, do the following:

Import `getMxAdapterMapObject` from the MX adapter package:

```typescript
import { getMxAdapterMapObject } from "@ucp-npm/mx-adapter";
```

Import the logger and cache client (redis) dependencies:

```typescript
import * as logger from "./infra/logger";
import { get, set } from "./services/storageClient/redis";
```

Next, look for the line that starts with `export const adapterMap = {`, and add the adapter map as follows:

```typescript
const mxAdapterMapObject = getMxAdapterMapObject({
  cacheClient: {
    set: set,
    get: get,
  },
  logClient: logger,
  aggregatorCredentials: {
    mxInt: {
      username: config.MX_CLIENT_ID,
      password: config.MX_API_SECRET,
    },
    mxProd: {
      username: config.MX_CLIENT_ID_PROD,
      password: config.MX_API_SECRET_PROD,
    },
  },
  envConfig: {
    HOSTURL: config.HOST_URL,
  },
});

export const adapterMap = {
  ...mxAdapterMapObject,
  ...testAdapterMapObject,
};
```

The `logClient` and `cacheClient` dependencies are provided by the Universal Connect Widget.

## Published NPM Package

https://www.npmjs.com/package/@ucp-npm/mx-adapter

## More Info

See [https://universalconnectproject.org/](https://universalconnectproject.org/) for more information.
