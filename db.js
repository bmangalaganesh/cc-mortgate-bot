const dbCredentials = {
  dbName: 'my_sample_db',
  host: '349d84bc-5fde-4ab5-8934-519c7a1d1667-bluemix.cloudant.com',
  port: 443,
  user: '349d84bc-5fde-4ab5-8934-519c7a1d1667-bluemix',
  password: 'a11a904c489fbbfc11bec4b8fb77d0e242ca4abd1a00a8e7899e876b06eab602',
  url: 'https://349d84bc-5fde-4ab5-8934-519c7a1d1667-bluemix:a11a904c489fbbfc11bec4b8fb77d0e242ca4abd1a00a8e7899e876b06eab602@349d84bc-5fde-4ab5-8934-519c7a1d1667-bluemix.cloudant.com',
};

const cloudant = require('cloudant')(dbCredentials.url);

const db = cloudant.use(dbCredentials.dbName);

module.exports = db;
