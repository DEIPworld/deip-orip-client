
const env = ( process.env.USE_LOCAL_CONFIG || process.env.NODE_ENV == 'local') 
    ? 'local' 
    : process.env.NODE_ENV || 'development';

require('dotenv').config({ path:  __dirname + '/' + 
    (env == 'production' ? '.prod.env' : env == 'development' ? '.dev.env' : '.local.env') })

const config = {
    NODE_ENV: process.env.NODE_ENV,
    DEIP_CLIENT_URL: process.env.DEIP_CLIENT_URL,
    DEIP_SERVER_URL: process.env.DEIP_SERVER_URL,
    DEIP_FULL_NODE_URL: process.env.DEIP_FULL_NODE_URL,
    SIG_SEED: process.env.SIG_SEED,
    CHAIN_ID: process.env.CHAIN_ID,
    ASSET_UNIT: process.env.ASSET_UNIT,
    TEST_NET_USER_FACTORY_CONFIG: process.env.TEST_NET_USER_FACTORY_CONFIG,
    TENANT: process.env.TENANT
};

module.exports = config;