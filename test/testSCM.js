require("dotenv").config();
const chai = require("chai");
const { expect, assert } = require("chai");
const truffleAssert = require('truffle-assertions');
const BN = require('bn.js')
chai.use(require('chai-bn')(BN))
const { ethers } = require("hardhat");

describe("ERC721 Token UNIT Tests", function () {
    /** BASE VARIABLES */
    let contract;
    let owner;
    let otherWallets;

    beforeEach(async () => {
        await deployments.fixture(['all']);

        const Contract = await deployments.get('SCM');
        contract = await ethers.getContractAt('SCM', Contract.address);

        [owner, ...res] = await ethers.getSigners();
        otherWallets = res;
    });

    /** VARIABLES */
    describe("#openseaProxyRegistryAddress()", () => {
        it("Should return the correct opensea proxy registery address", async () => {
            
        });
    });
});
