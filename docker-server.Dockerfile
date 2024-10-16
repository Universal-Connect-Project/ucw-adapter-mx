# NOTE: This Dockerfile is not meant to be run alone, but can be for development purposes.
# See the DOCKER.md file in the root of the project for more information.
# Please run `docker compose up` from the root of the project to run the docker environment for
# the UCW-APP project, which this Dockerfile is part of.
ARG WRKDR=~/app

FROM alpine:3.20.3 AS base
ENV NODE_VERSION 20.15.0

RUN $(echo ${WRKDR})

RUN apk --update --no-cache --virtual add nodejs npm bash \
    && rm -rf /var/cache/apk/*

FROM base AS pruner
RUN npm i -g turbo
ARG APP
ARG WRKDR

#WORKDIR ${WRKDR}

COPY . ${WRKDR}
RUN turbo prune ${APP} --docker

FROM base AS builder
ARG APP
ARG WRKDR

#WORKDIR ${WRKDR}

COPY --from=pruner ${WRKDR}/out/full/ ${WRKDR}
COPY --from=pruner ${WRKDR}/out/json/apps/${APP}/package.json ${WRKDR}
COPY --from=pruner ${WRKDR}/out/json/packages/utils/package.json ${WRKDR}/packages/utils/package.json
COPY --from=pruner ${WRKDR}/out/json/packages/mx-adapter/package.json ${WRKDR}/packages/mx-adapter/package.json
COPY --from=pruner ${WRKDR}/out/package-lock.json ${WRKDR}

RUN npm i -g turbo tsc \
    && npm ci

RUN chmod +x ${WRKDR}/packages/mx-adapter/scripts/rename-esm.sh

RUN turbo run build --filter=@ucp-npm/mx-adapter

RUN ls -al ${WRKDR}/packages/mx-adapter/dist

FROM base AS runner
ARG APP
ARG WRKDR

#WORKDIR ${WRKDR}

RUN npm i -g ts-node \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nodejs
USER nodejs

COPY --from=pruner --chown=nodejs:nodejs ${WRKDR}/out/full/apps/${APP}/ ${WRKDR}
COPY --from=pruner --chown=nodejs:nodejs ${WRKDR}/out/full/packages/utils/ ${WRKDR}/packages/utils/
COPY --from=builder --chown=nodejs:nodejs ${WRKDR}/packages/mx-adapter/dist ${WRKDR}/packages/mx-adapter/dist
#COPY --from=builder --chown=nodejs:nodejs ${WRKDR}/node_modules/ ${WRKDR}/node_modules

RUN ls -al ${WRKDR}/packages/mx-adapter/dist

EXPOSE ${PORT}

CMD ["ts-node", "./src/server.js"]
