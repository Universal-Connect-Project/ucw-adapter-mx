import * as dotenv from "dotenv";

export const init = (path = ".env") => {
  const result: dotenv.DotenvConfigOutput = dotenv.config({
    path
  });

  if (result.error) {
    throw result.error;
  }

  const { parsed: envs } = result;

  // Validate envs
  if (!envs?.HOSTURL) {
    throw new Error("Missing HostUrl. Check README.md and `../.env.example` for more info.");
  }

  if (!envs?.MXCLIENTID && !envs?.MXCLIENTIDPROD) {
    throw new Error("Missing MxClientId or MxClientIdProd. Check README.md and `../.env.example` for more info.");
  }

  if (!envs?.MXAPISECRET && !envs?.MXAPISECRETPROD) {
    throw new Error("Missing MxApiSecret or MxApiSecretProd. Check README.md and `../.env.example` for more info.");
  }

  return {
    HostUrl: envs?.HOSTURL,
    MxClientId: envs?.MXCLIENTID,
    MxApiSecret: envs?.MXAPISECRET,
    MxClientIdProd: envs?.MXCLIENTIDPROD,
    MxApiSecretProd: envs?.MXAPISECRETPROD
  };
};

export default init();