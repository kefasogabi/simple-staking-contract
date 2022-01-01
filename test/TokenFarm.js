const { assert } = require('chai');

const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

require('chai').use(require('chai-as-promised')).should();

function tokens(n){
   return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {

    let daiToken, dappToken, tokenFarm;

    before( async () => {

        // Load contracts
        daiToken = await DaiToken.new();
        dappToken = await DappToken.new();
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

        // Transfer all tokens to TokenFarm (1 million)
        await dappToken.transfer(tokenFarm.address, tokens('1000000'));

        // Send tokens to investor
        await daiToken.transfer(investor, tokens('100'), {from: owner});
    })

    describe('Mock DAI Deployment', async () => {
        
        it('has a name', async () => {
            let name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token', "Incorrect name");
        })
    });

    describe('Dapp Token Deployment', async () => {
        
        it('has a name', async () => {
            let name = await dappToken.name()
            assert.equal(name, 'DApp Token', "Incorrect name");
        })

    });

    describe('Token Farm Deployment', async () => {
        
        it('has a name', async () => {
            let name = await tokenFarm.name()
            assert.equal(name, 'Dapp Token Farm', "Incorrect name");
        })

        it('Contract has token', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(),  tokens('1000000'), "Incorrect Value of token");
        })
    });

    describe('Farming Tokens', async () => {
        
        it('rewards investors for staking mDai tokens', async () => {
           let result;
            
           //Check investor balance before staking
           result = await daiToken.balanceOf(investor)
           assert.equal(result.toString(), tokens('100'), "investor Mock DAI wallet balance should be correct before staking");

           //Stake Mock DAI Tokens
           await daiToken.approve(tokenFarm.address, tokens('100'), {from: investor})
           await tokenFarm.stakeTokens(tokens('100'), {from:investor})

           //Check staking result
           result = await daiToken.balanceOf(investor)
           assert.equal(result.toString(), tokens('0'), "Investor Mock DAI wallet balance incorrect after staking");

           result = await daiToken.balanceOf(tokenFarm.address)
           assert.equal(result.toString(), tokens('100'), "Token farm Mock DAI balance incorrect after staking");

           result = await tokenFarm.stakingBalance(investor)
           assert.equal(result.toString(), tokens('100'), "investor staking balance incorrect after staking");

           result = await tokenFarm.isStaking(investor)
           assert.equal(result.toString(), 'true', "investor staking status incorrect after staking");

           // Issue Tokens
           await tokenFarm.issueTokens({from:owner});

           // Check balance after issue
           result = await dappToken.balanceOf(investor);
           assert.equal(result.toString(), tokens('100'), "investor DApp Token Wallet balance incorrect after issuance")

        
           // Ensure that only owner can issue tokens
           await tokenFarm.issueTokens({from: investor}).should.be.rejected;

           // Unstake tokens
           await tokenFarm.unstakeTokens(tokens('50'), {from: investor});

           // Check result after unstaking
           result = await daiToken.balanceOf(investor);
           assert.equal(result.toString(), tokens('50'), "investor Mock DAI wallet balance incorrect after unstaking");

           result = await daiToken.balanceOf(tokenFarm.address);
           assert.equal(result.toString(), tokens('50'), "Token Farm Mock DAI wallet balance incorrect after unstaking");

           result = await tokenFarm.stakingBalance(investor);
           assert.equal(result.toString(), tokens('50'), "investor staking balance incorrect after unstaking");

           result = await tokenFarm.isStaking(investor)
           assert.equal(result.toString(), 'true', "investor staking status incorrect after unstaking");

        })

    });
})