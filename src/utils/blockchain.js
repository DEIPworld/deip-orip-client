import deipRpc from '@deip/deip-oa-rpc-client';

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
                        reject(err);
                    }
                });
            }
        });
    })
}

export async function getTransaction(trxId) {
    return new Promise((resolve, reject) => {
        deipRpc.api.getTransaction(trxId, function(err, result) {
            if (err) {
                return reject(err)
            }
            resolve(result);
        });
    })
}

export async function getTransactionHex(trx) {
    return new Promise((resolve, reject) => {
        deipRpc.api.getTransactionHex(trx, function(err, result) {
            if (err) {
                return reject(err)
            }
            resolve(result);
        });
    })
}


export async function getBlock(blockNum) {
    return new Promise((resolve, reject) => {
        deipRpc.api.getBlock(blockNum, function(err, result) {
            if (err) {
                return reject(err)
            }
            resolve(result);
        });
    })
}


export async function getBlockHeader(blockNum) {
    return new Promise((resolve, reject) => {
        deipRpc.api.getBlockHeader(blockNum, function(err, result) {
            if (err) {
                return reject(err)
            }
            resolve(result);
        });
    })
}


export async function getDynamicGlobalProperties() {
    return new Promise((resolve, reject) => {
        deipRpc.api.getDynamicGlobalProperties(function(err, result) {
            if (err) {
                return reject(err)
            }
            resolve(result);
        });
    })
}

export async function getChainProperties() {
    return new Promise((resolve, reject) => {
        deipRpc.api.getChainProperties(function(err, result) {
            if (err) {
                return reject(err)
            }
            resolve(result);
        });
    })
}


export async function getWitnesses([ids]) {
    return new Promise((resolve, reject) => {
        deipRpc.api.getWitnesses([ids], function(err, result) {
            if (err) {
                return reject(err)
            }
            resolve(result);
        });
    })
}


export async function getWitnessByAccount(account) {
    return new Promise((resolve, reject) => {
        deipRpc.api.getWitnessByAccount(account, function(err, result) {
            if (err) {
                return reject(err)
            }
            resolve(result);
        });
    })
}


export async function getConfig() {
    return new Promise((resolve, reject) => {
        deipRpc.api.getConfig(function(err, result) {
            if (err) {
                return reject(err)
            }
            resolve(result);
        });
    })
}



export async function findBlocksByRange(startTime, endTime) {

    const props = await getDynamicGlobalProperties();

    var lastBlock = props.head_block_number;
    var upperBound = lastBlock;
    var lowerBound = 1;
    var midpoint = null;

    while (lowerBound + 1 < upperBound) {
        var probe = Math.floor((upperBound + lowerBound) / 2)
        var b = await getBlockHeader(probe)
        // console.log("block", probe, b['timestamp'])

        if (b['timestamp'] < startTime) {
            lowerBound = probe
        }
        else if (b['timestamp'] > endTime) {
            upperBound = probe
        }
        else {
            midpoint = probe
            break;
        }
    }

    var tooLarge = midpoint

    while (lowerBound + 1 < tooLarge) {
        var probe = Math.floor((lowerBound + tooLarge) / 2)
        var b = await getBlockHeader(probe)
        // console.log("block", probe, b['timestamp'])
        if (b['timestamp'] <= startTime) {
            lowerBound = probe
        }
        else {
            tooLarge = probe
        }
    }

    var tooSmall = midpoint

    while(tooSmall + 1 < upperBound) {
        var probe = Math.floor((tooSmall + upperBound) / 2)
        var b = await getBlockHeader(probe)
        // console.log("block", probe, b['timestamp'])

        if (b['timestamp'] <= endTime){
            tooSmall = probe
        }
        else {
            upperBound = probe
        }
    }

    var firstBlock = await getBlockHeader(lowerBound)
    var lastBlock = await getBlockHeader(upperBound - 1)

    // console.log("First block:", lowerBound, firstBlock['timestamp'])
    // console.log("Last block:", upperBound - 1, lastBlock['timestamp'])
    return { first: { num: lowerBound, block: firstBlock }, last: { num: upperBound - 1, block: lastBlock } };
}