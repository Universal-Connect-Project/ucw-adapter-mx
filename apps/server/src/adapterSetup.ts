import { getMxAdapterMapObject } from "@ucp-npm/mx-adapter";
import type { AdapterMap } from "@repo/utils";

import config from "./config";
import { get, set } from "./services/storageClient/redis";
import * as logger from "./infra/logger";

import { adapterMapObject as testAdapterMapObject } from "./test-adapter";
import { getTemplateAdapterMapObject } from "@ucp-npm/template-adapter";

const templateAdapterMapObject = getTemplateAdapterMapObject();

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

// This is where you add adapters
export const adapterMap: Record<string, AdapterMap> = {
  ...mxAdapterMapObject,
  ...templateAdapterMapObject,
  ...testAdapterMapObject,
};

export type Aggregator = keyof typeof adapterMap;
export const aggregators = Object.keys(adapterMap);
