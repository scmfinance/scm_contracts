require("dotenv").config();
const chai = require("chai");
const { expect, assert } = require("chai");
const truffleAssert = require('truffle-assertions');
const BN = require('bn.js')

const { ethers } = require("hardhat");
const { solidity } = require('ethereum-waffle');

chai.use(solidity);
chai.use(require('chai-bn')(BN));

describe("PRE-SALE Contract UNIT Tests", function () {
    /** ERC-721 SETTINGS */
    const maxSupply = 10000;
    const maxMintsPerUser = 10;
    const mintPrice = ethers.utils.parseEther("0.05");
    const isSaleActive = false;
    const isFrozen = false;
    const saleOpen = 123456789;
    const saleDuration = 12345;
    const preSaleMerkleRoot = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const giveAwayMerkleRoot = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const giveAwaySupply = 350;

    const minterRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
    const burnerRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("BURNER_ROLE"));

    /** BASE VARIABLES */
    let contract;
    let contractNFT;
    let owner;
    let address_one;
    let address_two;
    let address_three;
    let mockProxyRegistry;
    let proxyForOwner;
    let otherWallets;

    beforeEach(async () => {
        await deployments.fixture(['all']);
        const Contract = await deployments.get('PreSaleContract');
        contract = await ethers.getContractAt('PreSaleContract', Contract.address);

        const ContractNFT = await deployments.get('NFT');
        contractNFT = await ethers.getContractAt('NFT', ContractNFT.address);

        [owner, address_one, address_two, address_three, proxyForOwner, ...res] = await ethers.getSigners();
        otherWallets = res;

        const MockProxyRegistry = await deployments.get("MockProxyRegistry");
        mockProxyRegistry = await ethers.getContractAt("MockProxyRegistry", MockProxyRegistry.address)
        await mockProxyRegistry.setProxy(owner.address, proxyForOwner.address)
    });

    /** HELPERS */
    async function setMinterRole(address) {
        await contractNFT.connect(owner).grantRole(minterRole, address);
    }

    async function setBurnerRole(address) {
        await contractNFT.connect(owner).grantRole(burnerRole, address);
    }

    async function mint(from, amount) {
        await setMinterRole(from.address);
        await (await contractNFT.connect(from).mintTo(amount, from.address)).wait();
        await contractNFT.connect(owner).revokeRole(minterRole, from.address);
    }

    function createMerkleProofForAddresses(addresses) {

    }

    function createGiveAwayMerkleProofForAddressesAndAmounts(addresses, amounts) {
        
    }

    /** VARIABLES */
    describe("#constructor", () => {
        it("Should set the correct variables", async () => {
            expect(await contract.maxSupply()).to.equal(maxSupply);
            expect(await contract.maxMintsPerUser()).to.equal(maxMintsPerUser);
            expect(await contract.mintPrice()).to.equal(mintPrice);
            expect(await contract.isSaleActive()).to.equal(isSaleActive);
            expect(await contract.isFrozen()).to.equal(isFrozen);
            expect(await contract.saleOpen()).to.equal(saleOpen);
            expect(await contract.saleDuration()).to.equal(saleDuration);
            expect(await contract.preSaleMerkleRoot()).to.equal(preSaleMerkleRoot);
            expect(await contract.giveAwayMerkleRoot()).to.equal(giveAwayMerkleRoot);
            expect(await contract.giveAwaySupply()).to.equal(giveAwaySupply);
            expect(await contract.nft()).to.equal(contractNFT.address);
        });
    });

    describe("setters", () => {
        it("flipSaleState", async () => {
            expect(await contract.isSaleActive()).to.equal(isSaleActive);
            await contract.connect(owner).flipSaleState()
            expect(await contract.isSaleActive()).to.equal(!isSaleActive);
            await contract.connect(owner).flipSaleState()
            expect(await contract.isSaleActive()).to.equal(isSaleActive);
        });

        it("setSaleOpen", async () => {
            expect(await contract.saleOpen()).to.equal(saleOpen);
            let newSaleOpen = 0;
            await contract.connect(owner).setSaleOpen(newSaleOpen);
            expect(await contract.saleOpen()).to.equal(newSaleOpen);
        });

        it("setSaleDuration", async () => {
            expect(await contract.saleDuration()).to.equal(saleDuration);
            let newSaleDuration = 0;
            await contract.connect(owner).setSaleDuration(newSaleDuration);
            expect(await contract.saleDuration()).to.equal(newSaleDuration);
        });

        it("setNFT", async () => {
            expect(await contract.nft()).to.equal(contractNFT.address);
            let newNFT = address_one.address;
            await contract.connect(owner).setNFT(newNFT);
            expect(await contract.nft()).to.equal(newNFT);
        });

        it("setMaxSupply", async () => {
            expect(await contract.maxSupply()).to.equal(maxSupply);
            let newMaxSupply = 0;
            await contract.connect(owner).setMaxSupply(newMaxSupply);
            expect(await contract.maxSupply()).to.equal(newMaxSupply);
        });

        it("setMaxMintPerUser", async () => {
            expect(await contract.maxMintsPerUser()).to.equal(maxMintsPerUser);
            let newMaxMintsPerUser = 0;
            await contract.connect(owner).setMaxMintPerUser(newMaxMintsPerUser);
            expect(await contract.maxMintsPerUser()).to.equal(newMaxMintsPerUser);
        });

        it("setMintPrice", async () => {
            expect(await contract.mintPrice()).to.equal(mintPrice);
            let newMintPrice = 0;
            await contract.connect(owner).setMintPrice(newMintPrice);
            expect(await contract.mintPrice()).to.equal(newMintPrice);
        });

        it("setGiveAwayMaxSupply", async () => {
            expect(await contract.giveAwaySupply()).to.equal(giveAwaySupply);
            let newGiveAwayMaxSupply = 0;
            await contract.connect(owner).setGiveAwayMaxSupply(newGiveAwayMaxSupply);
            expect(await contract.giveAwaySupply()).to.equal(newGiveAwayMaxSupply);
        });

        it("setPreSaleMerkleRoot", async () => {
            expect(await contract.preSaleMerkleRoot()).to.equal(preSaleMerkleRoot);
            let newPreSaleMerkleRoot = minterRole;
            await contract.connect(owner).setPreSaleMerkleRoot(newPreSaleMerkleRoot);
            expect(await contract.preSaleMerkleRoot()).to.equal(newPreSaleMerkleRoot);
        });

        it("setGiveAwayMerkleRoot", async () => {
            expect(await contract.giveAwayMerkleRoot()).to.equal(giveAwayMerkleRoot);
            let newGiveAwayMerkleRoot = minterRole;
            await contract.connect(owner).setGiveAwayMerkleRoot(newGiveAwayMerkleRoot);
            expect(await contract.giveAwayMerkleRoot()).to.equal(newGiveAwayMerkleRoot);
        });
    });

    describe("checkMintProof", () => {
        it("Should allow an address with a correct proof through", async () => {

        });

        it("Should not allow an address with an incorrect proof through", async () => {

        });

        it("Should not allow an address to mint with someone else's proof", async () => {

        });

        it("Should not allow an address with a zero proof to mint", async () => {

        });

        it("Should not allow an address to mint with a zero merkle root", async () => {

        });
    })

    describe("checkGiveAwayProof", () => {
        it("Should allow an address with a correct proof through", async () => {

        });

        it("Should not allow an address with an incorrect proof through", async () => {

        });

        it("Should not allow an address to mint with someone else's proof", async () => {

        });

        it("Should not allow an address with a zero proof to mint", async () => {

        });

        it("Should not allow an address to mint with a zero merkle root", async () => {

        });

        it("Should not allow someone through with an incorrect amount and the correct proof", async () => {

        });
    });

    describe("Check mint", () => {

    });

    describe("Check giveaway", () => {

    });

    describe("preSaleMint", () => {

    });

    describe("claimGiveaway", () => {

    })

    describe("freeze", () => {

    });

    describe("withdrawAll", () => {

    })

    describe("burn", () => {

    })
});
