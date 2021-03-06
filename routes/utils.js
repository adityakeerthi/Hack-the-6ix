 /** All IPFS Test Code for Hackathons and Personal Projects ~~ Aditya */
const IPFS = require('ipfs-api');
const axios = require('axios');
const ethers = require('ethers');
const fetch = require('node-fetch');

const { abi, address } = require('../contract');
const URL = 'HTTP://127.0.0.1:7545';
const customHttpProvider = new ethers.providers.JsonRpcProvider(URL);
let Contract = new ethers.Contract(address, abi, customHttpProvider.getSigner(0));

const ipfs = new IPFS({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https'
});

const timeStamp = () => {
    const today = new Date();
    return ( today.getFullYear().toString() + '.' + (today.getMonth() + 1).toString() + '.' + today.getDate().toString());
};

const get = async hash => {
    const URL = "https://gateway.ipfs.io/ipfs/" + hash;
    try {
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error(error)
    }
}

const createNewAccount = async (walletid, gitid) => {
    // const ipfshash = await Contract.get();
    const ipfshash = 'QmYQMYwFSMBfigdhHKNx51TT2sp1iUmRyJS1Enfy5CLeUX';

    if (ipfshash == 'QmbJWAESqCsf4RFCqEY7jecCashj8usXiyDNfKtZCwwzGb') { // Empty
        let MDB = {};
        MDB["accounts"] = {
            [walletid]: {
                gitid,
                "bountiesCompleted": 0,
                "bankAccount": 0,
                "bounties": []
            }
        };
        let buffer = Buffer.from(JSON.stringify(MDB));

        return new Promise((resolve, reject) => {
            ipfs.files.add(buffer, async (err, res) => {
                if (err) console.error(err);         
                else {
                    const hash = await res[0].hash;
                    resolve(hash);
                };
            });
        });
    } else {
        let MDB = await get(ipfshash);
        MDB["accounts"][walletid] = {
            gitid,
            "bountiesCompleted": 0,
            "bankAccount": 0,
            "bounties": []   
        };
        let buffer = Buffer.from(JSON.stringify(MDB));

        return new Promise((resolve, reject) => {
            ipfs.files.add(buffer, async (err, res) => {
                if (err) console.error(err);
                else {
                    const hash = await res[0].hash;
                    resolve(hash);
                };
            });
        });
    };
};

const createBounty = async (bountyname, gitid, walletid, desc, amount, repo) => {
    // const ipfshash = await Contract.get();
    const ipfshash = 'QmYQMYwFSMBfigdhHKNx51TT2sp1iUmRyJS1Enfy5CLeUX';
    if (ipfshash == 'QmbJWAESqCsf4RFCqEY7jecCashj8usXiyDNfKtZCwwzGb') { // Empty
        let MDB = {};
        const timestamp = timeStamp();
        MDB["bounties"] = {
            [bountyname]: {
                gitid,
                walletid,
                repo,
                "status": 'open',
                amount,
                timestamp,
                "contributors": [],
                desc
            }
        };
        MDB["accounts"][walletid]["bounties"].append(bountyname);
        let buffer = Buffer.from(JSON.stringify(MDB));

        return new Promise((resolve, reject) => {
            ipfs.files.add(buffer, async (err, res) => {
                if (err) console.error(err);
                else {
                    const hash = await res[0].hash;
                    resolve(hash);
                };
            });
        });
    } else {
        let MDB = await get(ipfshash);
        const timestamp = timeStamp();
        if (!MDB["bounties"]) {
            MDB["bounties"] = {};
        }

        MDB["bounties"][bountyname] = {
            gitid,
            walletid,
            repo,
            "status": 'open',
            amount,
            timestamp,
            "contributors": [],
            desc
        };
        MDB["accounts"][walletid]["bounties"].push(bountyname);
        let buffer = Buffer.from(JSON.stringify(MDB));

        return new Promise((resolve, reject) => {
            ipfs.files.add(buffer, async (err, res) => {
                if (err) console.error(err);
                else {
                    const hash = res[0].hash;
                    resolve(hash);
                }
            })
        });
    };
};

const updateUserData = async (walletid, bountyCompleted, newMoney) => {
    // const ipfshash = await Contract.get();
    const ipfshash = 'QmYQMYwFSMBfigdhHKNx51TT2sp1iUmRyJS1Enfy5CLeUX';
    let obj = await get(ipfshash);
    let MDB = obj;
    if (bountyCompleted) {
        MDB["accounts"][walletid]["bountiesCompleted"] = obj["accounts"][walletid]["bountiesCompleted"] + 1;
    };
    MDB["accounts"][walletid]["bankAccount"] = obj["accounts"][walletid]["bankAccount"] + newMoney;
    let buffer = Buffer.from(JSON.stringify(MDB));

    return new Promise((resolve, reject) => {
        ipfs.files.add(buffer, async (err, res) => {
            if (err) console.error(err);
            else {
                const hash = await res[0].hash;
                resolve(hash);
            };
        });
    });
};

const updateBountyStatus = async (bountyname, status) => {
    // const ipfshash = await Contract.get();
    const ipfshash = 'QmYQMYwFSMBfigdhHKNx51TT2sp1iUmRyJS1Enfy5CLeUX';
    let MDB = await get(ipfshash);
    MDB["bounties"][bountyname]["status"] = status;

    let buffer = Buffer.from(JSON.stringify(MDB));

    // Add smart contract stuff or anything else for extra stuff

    return new Promise((resolve, reject) => {
        ipfs.files.add(buffer, async (err, res) => {
            if (err) console.error(err);
            else {
                const hash = await res[0].hash;
                resolve(hash);
            };
        });
    });
};

const donateToExistingBounty = async (bountyname, updateValue) => {
    // const ipfshash = await Contract.get();
    const ipfshash = 'QmYQMYwFSMBfigdhHKNx51TT2sp1iUmRyJS1Enfy5CLeUX';
    let MDB = await get(ipfshash);
    MDB["bounties"][bountyname]["amount"] += updateValue;

    let buffer = Buffer.from(JSON.stringify(MDB));

    // Add smart contract stuff or anything else for extra stuff

    return new Promise((resolve, reject) => {
        ipfs.files.add(buffer, async (err, res) => {
            if (err) console.error(err);
            else {
                const hash = await res[0].hash;
                resolve(hash);
            };
        });
    });
};

const retrieveUserData = async (walletid) => {
    // const ipfshash = await Contract.get();
    const ipfshash = 'QmYQMYwFSMBfigdhHKNx51TT2sp1iUmRyJS1Enfy5CLeUX';
    const data = await get(ipfshash);
    return data["accounts"][walletid];
};

const getAllBounties = async () => {
    // const ipfshash = await Contract.get();
    const ipfshash = 'QmXtW6EhfUt8mFENYsUG9iBsgU5Pzy2qZUQ5NHVXEfygB1';
    const data = await get(ipfshash);
    return data["bounties"];
};

const retrieveBounty = async (bountyname) => {
    // const ipfshash = await Contract.get();
    const ipfshash = 'QmYQMYwFSMBfigdhHKNx51TT2sp1iUmRyJS1Enfy5CLeUX';
    const data = await get(ipfshash);
    return data["bounties"][bountyname];
};

const gitToWallet = async (gitid) => {
    // const ipfshash = await Contract.get();
    const ipfshash = 'QmXtW6EhfUt8mFENYsUG9iBsgU5Pzy2qZUQ5NHVXEfygB1';
    const data = await get(ipfshash);
    const accounts = Object.keys(data["accounts"]);
    for (let i=0; i<accounts.length; i++) {
        if (data["accounts"][accounts[i]]["gitid"] == gitid) {
            return data["accounts"][accounts[i]]["gitid"];
        };
    }
    return "Not Found";
};
module.exports = {
    updateUserData,
    updateBountyStatus,
    retrieveUserData,
    retrieveBounty,
    getAllBounties,
    gitToWallet,
    donateToExistingBounty,
    updateBountyStatus,
    createBounty,
    createNewAccount
};