
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
    DEIP_CHAIN_EXPLORER_URL: process.env.DEIP_CHAIN_EXPLORER_URL,
    SIG_SEED: process.env.SIG_SEED,
    CHAIN_ID: process.env.CHAIN_ID,
    ASSET_UNIT: process.env.ASSET_UNIT,
    TENANT: process.env.TENANT,
    DEMO: process.env.DEMO,
    GRANT_DISTRIBUTION_TRANSPARENCY_DEMO_GRANT_ATTR_ID: process.env.GRANT_DISTRIBUTION_TRANSPARENCY_DEMO_GRANT_ATTR_ID
};

module.exports = config;