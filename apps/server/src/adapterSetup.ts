import type { AdapterMap } from "@repo/utils";

import config from "./config";
import * as logger from "./infra/logger";
import { get, set } from "./services/storageClient/redis";

import { getMxAdapterMapObject } from "@ucp-npm/mx-adapter";
import { getTemplateAdapterMapObject } from "@ucp-npm/template-adapter";
import { adapterMapObject as testAdapterMapObject } from "./test-adapter";

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
    PROXY_HOST: config.PROXY_HOST,
    PROXY_PORT: config.PROXY_PORT,
    PROXY_USERNAME: config.PROXY_USERNAME,
    PROXY_PASSWORD: config.PROXY_PASSWORD,
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
