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
    throw new Error("Missing HOSTURL. Check README.md and `../.env.example` for more info.");
  }

  if (!envs?.MXCLIENTID && !envs?.MXCLIENTIDPROD) {
    throw new Error("Missing MXCLIENTID or MXCLIENTIDPROD. Check README.md and `../.env.example` for more info.");
  }

  if (!envs?.MXAPISECRET && !envs?.MXAPISECRETPROD) {
    throw new Error("Missing MXAPISECRET or MXAPISECRETPROD. Check README.md and `../.env.example` for more info.");
  }

  return {
    HOSTURL: envs?.HOSTURL,
    MXCLIENTID: envs?.MXCLIENTID,
    MXAPISECRET: envs?.MXAPISECRET,
    MXCLIENTIDPROD: envs?.MXCLIENTIDPROD,
    MXAPISECRETPROD: envs?.MXAPISECRETPROD
  };
};

export default init();