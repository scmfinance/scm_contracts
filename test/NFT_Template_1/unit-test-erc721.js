require("dotenv").config();
const chai = require("chai");
const { expect, assert } = require("chai");
const truffleAssert = require('truffle-assertions');
const BN = require('bn.js')
chai.use(require('chai-bn')(BN))
const { ethers } = require("hardhat");

describe("ERC721 Token UNIT Tests", function () {
    /** ERC-721 SETTINGS */
    const baseURIString = "baseURIString";
    const preRevealBaseURIString = "preRevealBaseURIString";
    const revealDate = 1923870486;
    const minterRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
    const burnerRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("BURNER_ROLE"));

    /** BASE VARIABLES */
    let contract;
    let owner;
    let mockProxyRegistry;
    let proxyForOwner;
    let otherWallets;

    beforeEach(async () => {
        await deployments.fixture(['all']);
        const Contract = await deployments.get('NFT');
        contract = await ethers.getContractAt('NFT', Contract.address);

        [owner, proxyForOwner, ...res] = await ethers.getSigners();
        otherWallets = res;

        const MockProxyRegistry = await deployments.get("MockProxyRegistry");
        mockProxyRegistry = await ethers.getContractAt("MockProxyRegistry", MockProxyRegistry.address)
        await mockProxyRegistry.setProxy(owner.address, proxyForOwner.address)
    });

    /** HELPERS */
    async function setMinterRole(address) {
        await contract.connect(owner).grantRole(minterRole, address);
    }

    async function setBurnerRole(address) {
        await contract.connect(owner).grantRole(burnerRole, address);
    }

    async function mint(from, amount) {
        await setMinterRole(from.address);
        await (await contract.connect(from).mintTo(amount, from.address)).wait();
        await contract.connect(owner).revokeRole(minterRole, from.address);
    }

    /** VARIABLES */
    describe("#openseaProxyRegistryAddress()", () => {
        it("Should return the correct opensea proxy registery address", async () => {
            let proxyAddress = await contract.openseaProxyRegistryAddress();
            proxyAddress = proxyAddress.toLowerCase();
            assert.equal(proxyAddress, mockProxyRegistry.address.toLowerCase());
        });
    });

    describe("#baseURIString()", () => {
        it("Should return the correct baseURIString", async () => {
            let _baseURIString = await contract.baseURIString();
            assert.equal(_baseURIString, baseURIString);
        });
    });

    describe("#preRevealBaseURIString()", () => {
        it("Should return the correct preRevealBaseURIString", async () => {
            let _preRevealBaseURIString = await contract.preRevealBaseURIString();
            assert.equal(_preRevealBaseURIString, preRevealBaseURIString);
        });
    });

    describe("#revealDate()", () => {
        it("Should return the correct revealDate", async () => {
            let _revealDate = await contract.revealDate();
            assert.equal(_revealDate, revealDate);
        });
    });

    describe("#minterRole()", () => {
        it("Should return the correct minter role", async () => {
            const _minterRole = await contract.MINTER_ROLE();
            assert.equal(_minterRole, minterRole);
        });
    })

    describe("#burnerRole()", () => {
        it("Should return the correct burner role", async () => {
            const _burnerRole = await contract.BURNER_ROLE();
            assert.equal(_burnerRole, burnerRole);
        });
    })

    /** ERC-721 */
    describe("#setBaseURI()", () => {
        it ("should update the base uri", async () => {
            let newBaseURI = "new";
            await (await contract.connect(owner).setBaseURI(newBaseURI)).wait();
            let baseUri = await contract.baseURIString();
            assert.equal(newBaseURI, baseUri);
        });
    })

    describe("#setBaseURI()", () => {
        it("should update the base uri", async () => {
            let newBaseURI = "new";
            await (await contract.connect(owner).setBaseURI(newBaseURI)).wait();
            let baseUri = await contract.baseURIString();
            assert.equal(newBaseURI, baseUri);
        });
    })

    describe("#mint()", () => {
        it("1. Should not mint token from wrong role", async () => {
            await truffleAssert.fails(
                contract.connect(owner).mintTo(1, owner.address),
                truffleAssert.ErrorType.revert,
                "AccessControl: account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6"
            );
        })

        it("2. Should not mint token from wrong role", async () => {
            await setMinterRole(owner.address);
            await truffleAssert.fails(
                contract.connect(otherWallets[0]).mintTo(1, otherWallets[0].address),
                truffleAssert.ErrorType.revert,
                "AccessControl: account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6"
            );
        });

        it("3 Should not mint token from wrong role", async () => {
            await setMinterRole(otherWallets[0].address);
            await contract.connect(owner).revokeRole(minterRole, otherWallets[0].address)
            await truffleAssert.fails(
                contract.connect(otherWallets[0]).mintTo(1, otherWallets[0].address),
                truffleAssert.ErrorType.revert,
                "AccessControl: account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6"
            );
        })

        it("Should correctly mint 1 token", async () => {
            await setMinterRole(owner.address);
            await (await contract.connect(owner).mintTo(1, owner.address)).wait();

            const balance = await contract.balanceOf(owner.address);
            const ownerOf = await contract.ownerOf(0);

            assert.equal(balance, 1);
            assert.equal(ownerOf, owner.address);
        })

        it("Should correctly mint 100 token", async () => {
            await setMinterRole(owner.address);
            await (await contract.connect(owner).mintTo(100, owner.address)).wait();

            const balance = await contract.balanceOf(owner.address);

            assert.equal(balance, 100);

            for (let i = 0; i < 100; i++) {
                const ownerOf = await contract.ownerOf(i);
                assert.equal(ownerOf, owner.address);
            }            
        })

        it("Should correctly mint 100 tokens to other address", async () => {
            await setMinterRole(owner.address);
            await (await contract.connect(owner).mintTo(100, otherWallets[0].address)).wait();

            const balance = await contract.balanceOf(otherWallets[0].address);

            assert.equal(balance, 100);

            for (let i = 0; i < 100; i++) {
                const ownerOf = await contract.ownerOf(i);
                assert.equal(ownerOf, otherWallets[0].address);
            }            
        })
    });

    describe("#burn()", () => {
        it("1. Should not burn token from wrong role", async () => {
            await mint(owner, 1)
            await truffleAssert.fails(
                contract.connect(owner).burn(1),
                truffleAssert.ErrorType.revert,
                "AccessControl: account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 is missing role 0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848"
            );
        })

        it("2. Should not mint token from wrong role", async () => {
            await mint(owner, 1);
            setBurnerRole(owner.address);
            await truffleAssert.fails(
                contract.connect(otherWallets[0]).burn(1),
                truffleAssert.ErrorType.revert,
                "AccessControl: account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc is missing role 0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848"
            );
        });

        it("3 Should not mint token from wrong role", async () => {
            await mint(owner, 1)
            await setBurnerRole(otherWallets[0].address);
            await contract.connect(owner).revokeRole(burnerRole, otherWallets[0].address)
            await truffleAssert.fails(
                contract.connect(otherWallets[0]).burn(1),
                truffleAssert.ErrorType.revert,
                "AccessControl: account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc is missing role 0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848"
            );
        })

        it("Should correctly burn 1 token", async () => {
            await mint(owner, 1)
            await setBurnerRole(owner.address);

            let balance = await contract.balanceOf(owner.address);
            const ownerOf = await contract.ownerOf(0);

            assert.equal(balance, 1);
            assert.equal(ownerOf, owner.address);

            await contract.connect(owner).burn(0);

            balance = await contract.balanceOf(owner.address);
            assert.equal(balance, 0)

            await truffleAssert.fails(
                contract.ownerOf(0),
                truffleAssert.ErrorType.revert,
                "ERC721: owner query for nonexistent token"
            );
        })

         it("Should correctly burn 100 token", async () => {
            await mint(owner, 100)
            await setBurnerRole(owner.address);

            let balance = await contract.balanceOf(owner.address);
            assert.equal(balance, 100);

            for (let i = 0; i < 100; i++) {
                const ownerOf = await contract.ownerOf(i);
                assert.equal(ownerOf, owner.address);
                await contract.connect(owner).burn(i);
            }

            balance = await contract.balanceOf(owner.address);
            assert.equal(balance, 0)

            for (let i = 0; i < 100; i++) {
                await truffleAssert.fails(
                    contract.ownerOf(i),
                    truffleAssert.ErrorType.revert,
                    "ERC721: owner query for nonexistent token"
                );
            }            
        })
    })

    describe("#tokenURI()", () => {
        it("Should return preRevealBaseURIString if current time is before reveal time", async () => {     
            await mint(owner, 1);       
            const tokenURI = await contract.tokenURI(0);
            assert.equal(preRevealBaseURIString + "0"+ ".json", tokenURI);
        });

        it("Should return baseURIString if current time is past reveal time", async () => {
            await mint(owner, 1);     
            let tokenURI = await contract.tokenURI(0);
            assert.equal(preRevealBaseURIString + "0" + ".json", tokenURI);

            await network.provider.send("evm_setNextBlockTimestamp", [revealDate + 1])
            await network.provider.send("evm_mine")
     
            tokenURI = await contract.tokenURI(0);
            assert.equal(baseURIString + "0" + ".json", tokenURI);
        });        
    })
    
    /** OPENSEA */
    describe('#isApprovedForAll()', () => {
        it('proxy should be approved for owner', async () => {
            assert.isTrue(await contract.isApprovedForAll(owner.address, proxyForOwner.address));
        });

        it('owner should not be approved for owner', async () => {
            assert.isFalse(await contract.isApprovedForAll(owner.address, owner.address));
        });

        it('addr1 should not be approved for owner', async () => {
            assert.isFalse(await contract.isApprovedForAll(owner.address, otherWallets[0].address));
        });
    });    
});
