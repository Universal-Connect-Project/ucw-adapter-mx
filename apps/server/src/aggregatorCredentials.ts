import config from './config'

const aggregatorCredentials = {
  akoyaSandbox: {
    clientId: config.AkoyaClientId,
    secret: config.AkoyaApiSecret,
    basePath: 'sandbox-idp.ddp.akoya.com',
    productPath: 'sandbox-products.ddp.akoya.com',
    aggregator: 'akoya_sandbox',
    available: true
  },
  akoyaProd: {
    clientId: config.AkoyaClientIdProd,
    secret: config.AkoyaApiSecretProd,
    basePath: 'idp.ddp.akoya.com',
    productPath: 'products.ddp.akoya.com',
    aggregator: 'akoya',
    available: true
  },
  finicityProd: {
    basePath: 'https://api.finicity.com',
    partnerId: config.FinicityPartnerId,
    appKey: config.FinicityAppKey,
    secret: config.FinicitySecret,
    aggregator: 'finicity',
    available: true
  },
  sophtron: {
    clientId: config.SophtronApiUserId,
    secret: config.SophtronApiUserSecret,
    endpoint: config.SophtronApiServiceEndpoint,
    vcEndpoint: config.SophtronVCServiceEndpoint,
    aggregator: 'sophtron',
    available: true
  }
}

export default aggregatorCredentials
