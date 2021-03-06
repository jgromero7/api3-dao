import {Api3Token, TestPool} from "../typechain";
import * as hre from "hardhat";
import {expect} from "chai";
import {jumpOneEpoch} from "./test_StakeUtils";

describe('DelegationUtils_delegate_undelegate', () => {
  let accounts: string[]
  let token: Api3Token
  let pool: TestPool
  let ownerAccount: Api3Token

  before(async () => {
    accounts = await hre.waffle.provider.listAccounts()
    const api3TokenFactory = await hre.ethers.getContractFactory("Api3Token")
    token = (await api3TokenFactory.deploy(accounts[0], accounts[0])) as Api3Token
    const api3PoolFactory = await hre.ethers.getContractFactory("TestPool")
    pool = (await api3PoolFactory.deploy(token.address)) as TestPool
    const signer0 = hre.waffle.provider.getSigner(0)
    ownerAccount = token.connect(signer0)
    await ownerAccount.updateMinterStatus(pool.address, true)
  })

  before(async () => {
    const testValue = 1000;
    const numAccounts = 3;
    // transfer, deposit, and stake tokens
    for (let i = 1; i <= numAccounts; i++) {
      await ownerAccount.transfer(accounts[i], testValue);
      const signer = hre.waffle.provider.getSigner(i)
      const staker = pool.connect(signer)
      await token.connect(signer).approve(pool.address, testValue);
      await staker.depositAndStake(accounts[i], testValue, accounts[i]);
    }
  })

  it('delegate shares', async () => {
    const signer = hre.waffle.provider.getSigner(1);
    // get starting values of user
    const startUserShares = await pool.shares(accounts[1]);
    const startIsDelegatingFlag = (await pool.users(accounts[1])).delegating;
    const startIsDelegating = await pool.userDelegating(accounts[1]);
    // get starting number of shares delegated to delegate
    const startDelegatedTo = await pool.delegatedTo(accounts[2]);
    // check starting values
    // expect(startIsDelegatingFlag).to.be.false;
    expect(startIsDelegating).to.be.false;
    expect(startDelegatedTo).to.equal(0);
    // delegate shares
    await pool.connect(signer).delegateShares(accounts[2]);
    // get ending values of user
    const endUserShares = await pool.shares(accounts[1]);
    const endIsDelegatingFlag = (await pool.users(accounts[1])).delegating;
    const endIsDelegating = await pool.userDelegating(accounts[1]);
    // get ending number of shares delegated to delegate
    const endDelegatedTo = await pool.delegatedTo(accounts[2]);
    // check ending values
    // expect(endIsDelegatingFlag).to.be.true;
    expect(endIsDelegating).to.be.true;
    expect(endDelegatedTo).to.equal(startUserShares);
    expect(startUserShares).to.equal(endUserShares);
  })

  it('undelegate shares', async () => {
    // jump ahead in time and trigger epochs
    await jumpOneEpoch(pool);
    await jumpOneEpoch(pool);
    const targetEpoch = await pool.getRewardTargetEpochTest();
    for (let i = 1; i <= 3; i++) {
      await pool.updateUserLocked(accounts[i], targetEpoch);
    }
    const signer = hre.waffle.provider.getSigner(1);
    // get starting values of user
    const startUserShares = await pool.shares(accounts[1]);
    const startIsDelegatingFlag = (await pool.users(accounts[1])).delegating;
    const startIsDelegating = await pool.userDelegating(accounts[1]);
    // get starting number of shares delegated to delegate
    const startDelegatedTo = await pool.delegatedTo(accounts[2]);
    // check starting values
    // expect(startIsDelegatingFlag).to.be.true;
    expect(startIsDelegating).to.be.true;
    expect(startDelegatedTo).to.equal(startUserShares);
    // undelegate shares
    await pool.connect(signer).undelegateShares();
    // get ending values of user
    const endUserShares = await pool.shares(accounts[1]);
    const endIsDelegatingFlag = (await pool.users(accounts[1])).delegating;
    const endIsDelegating = await pool.userDelegating(accounts[1]);
    // get ending number of shares delegated to delegate
    const endDelegatedTo = await pool.delegatedTo(accounts[2]);
    // check ending values
    // expect(endIsDelegatingFlag).to.be.false;
    expect(endIsDelegating).to.be.false;
    expect(endDelegatedTo).to.equal(0);
    expect(startUserShares).to.equal(endUserShares);
  })

})


describe('DelegationUtils_changing_staking', () => {
  let accounts: string[]
  let token: Api3Token
  let pool: TestPool
  let ownerAccount: Api3Token

  before(async () => {
    accounts = await hre.waffle.provider.listAccounts()
    const api3TokenFactory = await hre.ethers.getContractFactory("Api3Token")
    token = (await api3TokenFactory.deploy(accounts[0], accounts[0])) as Api3Token
    const api3PoolFactory = await hre.ethers.getContractFactory("TestPool")
    pool = (await api3PoolFactory.deploy(token.address)) as TestPool
    const signer0 = hre.waffle.provider.getSigner(0)
    ownerAccount = token.connect(signer0)
    await ownerAccount.updateMinterStatus(pool.address, true)
  })

  before(async () => {
    const testValue = 1000;
    const numAccounts = 3;
    // transfer, deposit, and stake tokens
    for (let i = 1; i <= numAccounts; i++) {
      await ownerAccount.transfer(accounts[i], testValue);
      const signer = hre.waffle.provider.getSigner(i)
      const staker = pool.connect(signer)
      await token.connect(signer).approve(pool.address, testValue);
      await staker.depositAndStake(accounts[i], testValue, accounts[i]);
    }
    // jump ahead in time and trigger epochs
    await jumpOneEpoch(pool);
    await jumpOneEpoch(pool);
    const targetEpoch = await pool.getRewardTargetEpochTest();
    for (let i = 1; i <= 3; i++) {
      await pool.updateUserLocked(accounts[i], targetEpoch);
    }
  })

  it('delegate shares and change delegates without undelegating', async () => {
    const signer = hre.waffle.provider.getSigner(1);
    // get starting values
    const startUserShares = await pool.shares(accounts[1]);
    const startIsDelegatingFlag = (await pool.users(accounts[1])).delegating;
    const startIsDelegating = await pool.userDelegating(accounts[1]);
    const startDelegatedTo1 = await pool.delegatedTo(accounts[1]);
    const startDelegatedTo2 = await pool.delegatedTo(accounts[2]);
    const startDelegatedTo3 = await pool.delegatedTo(accounts[3]);
    // check starting values
    // expect(startIsDelegatingFlag).to.be.false;
    expect(startIsDelegating).to.be.false;
    expect(startDelegatedTo1).to.equal(0);
    expect(startDelegatedTo2).to.equal(0);
    expect(startDelegatedTo3).to.equal(0);
    // delegate shares to account 2
    await pool.connect(signer).delegateShares(accounts[2]);
    // jump ahead in time and trigger epochs
    await jumpOneEpoch(pool);
    await jumpOneEpoch(pool);
    for (let i = 1; i <= 3; i++) {
      const targetEpoch = await pool.getRewardTargetEpochTest();
      await pool.updateUserLocked(accounts[i], targetEpoch);
    }
    // get intermediate values
    const midIsDelegatingFlag = (await pool.users(accounts[1])).delegating;
    const midIsDelegating = await pool.userDelegating(accounts[1]);
    const midDelegatedTo1 = await pool.delegatedTo(accounts[1]);
    const midDelegatedTo2 = await pool.delegatedTo(accounts[2]);
    const midDelegatedTo3 = await pool.delegatedTo(accounts[3]);
    // check intermediate values
    // expect(midIsDelegatingFlag).to.be.true;
    expect(midIsDelegating).to.be.true;
    expect(midDelegatedTo1).to.equal(0);
    expect(midDelegatedTo2).to.equal(startUserShares);
    expect(midDelegatedTo3).to.equal(0);
    // delegate shares to account 3
    await pool.connect(signer).delegateShares(accounts[3]);
    // jump ahead in time
    await jumpOneEpoch(pool);
    // get ending values
    const endIsDelegatingFlag = (await pool.users(accounts[1])).delegating;
    const endIsDelegating = await pool.userDelegating(accounts[1]);
    const endDelegatedTo1 = await pool.delegatedTo(accounts[1]);
    const endDelegatedTo2 = await pool.delegatedTo(accounts[2]);
    const endDelegatedTo3 = await pool.delegatedTo(accounts[3]);
    // check ending values
    // expect(endIsDelegatingFlag).to.be.true;
    expect(endIsDelegating).to.be.true;
    expect(endDelegatedTo1).to.equal(0);
    expect(endDelegatedTo2).to.equal(0);
    expect(endDelegatedTo3).to.equal(startUserShares);
  })

  it('undelegate, delegate, unstake, then stake', async () => {
    const signer = hre.waffle.provider.getSigner(1);
    // undelegate shares
    await pool.connect(signer).undelegateShares();
    // get starting values
    const startUserShares = await pool.shares(accounts[1]);
    const startIsDelegating = await pool.userDelegating(accounts[1]);
    const startDelegatedTo2 = await pool.delegatedTo(accounts[2]);
    const startDelegatedTo3 = await pool.delegatedTo(accounts[3]);
    // check starting values
    expect(startIsDelegating).to.be.false;
    expect(startDelegatedTo2).to.equal(0);
    expect(startDelegatedTo3).to.equal(0);
    // delegate shares
    await pool.connect(signer).delegateShares(accounts[2]);
    const earlyDelegatedTo2 = await pool.delegatedTo(accounts[2]);
    expect(earlyDelegatedTo2).to.equal(startUserShares);
    // schedule unstake for half of user's tokens
    const userStake = await pool.userStaked(accounts[1]);
    await pool.connect(signer).scheduleUnstake(userStake.div(2));
    await jumpOneEpoch(pool);
    // get values for later and then unstake
    await pool.connect(signer).unstake();
    // get delegation values after unstake
    const midUserShares = await pool.shares(accounts[1]);
    const midIsDelegating = await pool.userDelegating(accounts[1]);
    const midDelegatedTo2 = await pool.delegatedTo(accounts[2]);
    // check delegation after unstake
    expect(midUserShares).to.be.gte(startUserShares.div(2));
    expect(midUserShares).to.be.lt(startUserShares);
    expect(midIsDelegating).to.be.true;
    expect(midDelegatedTo2).to.equal(midUserShares);
    // stake again
    await pool.connect(signer).stake(userStake.div(2));
    // get ending values
    const endUserShares = await pool.shares(accounts[1]);
    const endIsDelegating = await pool.userDelegating(accounts[1]);
    const endDelegatedTo = await pool.delegatedTo(accounts[2]);
    // check ending values
    expect(endIsDelegating).to.be.true;
    expect(endDelegatedTo).to.equal(endUserShares);
  })

})