import * as dotenv from "dotenv";

export const init = (path = ".env") => {
  let envs: Record<string, string> = {};

  const result: dotenv.DotenvConfigOutput = dotenv.config({
    path
  });

  if (result.error) {
    throw result.error;
  } else {
    envs = result.parsed || {
      HOSTURL: process.env?.HOSTURL,
      MXCLIENTID: process.env?.MXCLIENTID,
      MXAPISECRET: process.env?.MXAPISECRET,
      MXCLIENTIDPROD: process.env?.MXCLIENTIDPROD,
      MXAPISECRETPROD: process.env?.MXAPISECRETPROD
    };
  }

  return {
    HOSTURL: envs?.HOSTURL || process.env?.HOSTURL,
    MXCLIENTID: envs?.MXCLIENTID || process.env?.MXCLIENTID,
    MXAPISECRET: envs?.MXAPISECRET || process.env?.MXAPISECRET,
    MXCLIENTIDPROD: envs?.MXCLIENTIDPROD || process.env?.MXCLIENTIDPROD,
    MXAPISECRETPROD: envs?.MXAPISECRETPROD || process.env?.MXAPISECRETPROD
  };
};

export default init();