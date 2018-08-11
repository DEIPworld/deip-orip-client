import deipRpc from '@deip/deip-rpc-client';



export function signOperation(operation, ownerKey) {
    
    return new Promise((resolve, reject) => {
        deipRpc.api.getDynamicGlobalProperties(function(err, result) {
            if (!err) {
                const BlockNum = (result.last_irreversible_block_num - 1) & 0xFFFF;
                deipRpc.api.getBlockHeader(result.last_irreversible_block_num, function(e, res) {
                    const BlockPrefix = new Buffer(res.previous, 'hex').readUInt32LE(4);
                    const now = new Date().getTime() + 3e6;
                    const expire = new Date(now).toISOString().split('.')[0];
    
                    const unsignedTX = {
                        'expiration': expire,
                        'extensions': [],
                        'operations': [operation],
                        'ref_block_num': BlockNum,
                        'ref_block_prefix': BlockPrefix
                    };
    
                    try {
                        const signedTX = deipRpc.auth.signTransaction(unsignedTX, { "owner":  ownerKey });          
                        resolve(signedTX);
                    } catch (err) {
                        reject();
                    }
                });
            }
        });
    })
}



