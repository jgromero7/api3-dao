const { expect } = require("chai");

let roles;
let api3Token, api3Pool;
const onePercent = ethers.BigNumber.from("1" + "000" + "000");
const hundredPercent = ethers.BigNumber.from("100" + "000" + "000");

beforeEach(async () => {
  const accounts = await ethers.getSigners();
  roles = {
    deployer: accounts[0],
    daoAgent: accounts[1],
    claimsManager: accounts[2],
    user1: accounts[3],
    user2: accounts[4],
    randomPerson: accounts[9],
  };
  const api3TokenFactory = await ethers.getContractFactory(
    "Api3Token",
    roles.deployer
  );
  api3Token = await api3TokenFactory.deploy(
    roles.deployer.address,
    roles.deployer.address
  );
  const api3PoolFactory = await ethers.getContractFactory(
    "Api3Pool",
    roles.deployer
  );
  api3Pool = await api3PoolFactory.deploy(api3Token.address);
});

describe("constructor", function () {
  it("initializes with the correct parameters", async function () {
    // Token address set correctly
    expect(await api3Pool.api3Token()).to.equal(api3Token.address);
    // No DAO Agent set
    expect(await api3Pool.daoAgent()).to.equal(ethers.constants.AddressZero);
    // Claims manager statuses are false by default
    expect(
      await api3Pool.claimsManagerStatus(roles.randomPerson.address)
    ).to.equal(false);
    // Epoch length is 7 days in seconds
    expect(await api3Pool.epochLength()).to.equal(
      ethers.BigNumber.from(7 * 24 * 60 * 60)
    );
    // Reward vesting period is 52 week = 1 year
    expect(await api3Pool.rewardVestingPeriod()).to.equal(
      ethers.BigNumber.from(52)
    );
    // Genesis epoch is the current epoch
    const currentBlock = await ethers.provider.getBlock(
      await ethers.provider.getBlockNumber()
    );
    const currentEpoch = ethers.BigNumber.from(currentBlock.timestamp).div(
      await api3Pool.epochLength()
    );
    expect(await api3Pool.genesisEpoch()).to.equal(currentEpoch);
    // Skip the reward payment of the genesis epoch
    expect(await api3Pool.epochIndexOfLastRewardPayment()).to.equal(
      await api3Pool.genesisEpoch()
    );
    // Verify the default DAO parameters
    expect(await api3Pool.stakeTarget()).to.equal(
      ethers.utils.parseEther("30" + "000" + "000")
    );
    expect(await api3Pool.minApr()).to.equal(
      ethers.BigNumber.from("2" + "500" + "000")
    );
    expect(await api3Pool.maxApr()).to.equal(
      ethers.BigNumber.from("75" + "000" + "000")
    );
    expect(await api3Pool.aprUpdateCoeff()).to.equal(
      ethers.BigNumber.from("1" + "000" + "000")
    );
    expect(await api3Pool.unstakeWaitPeriod()).to.equal(
      ethers.BigNumber.from(7 * 24 * 60 * 60)
    );
    // Initialize the APR at max APR
    expect(await api3Pool.currentApr()).to.equal(await api3Pool.maxApr());
    // Initialize share price at 1
    expect(await api3Pool.totalSupply()).to.equal(ethers.BigNumber.from(1));
    expect(await api3Pool.totalStake()).to.equal(ethers.BigNumber.from(1));
  });
});

describe("setDaoAgent", function () {
  context("DAO Agent address to be set is not zero", function () {
    context("DAO Agent adress has not been set before", function () {
      it("sets DAO Agent", async function () {
        await expect(
          api3Pool
            .connect(roles.randomPerson)
            .setDaoAgent(roles.daoAgent.address)
        )
          .to.emit(api3Pool, "SetDaoAgent")
          .withArgs(roles.daoAgent.address);
        expect(await api3Pool.daoAgent()).to.equal(roles.daoAgent.address);
      });
    });
    context("DAO Agent adress has been set before", function () {
      it("reverts", async function () {
        // Set the DAO Agent once
        await api3Pool
          .connect(roles.randomPerson)
          .setDaoAgent(roles.daoAgent.address);
        // Attempt to set it again
        await expect(
          api3Pool
            .connect(roles.randomPerson)
            .setDaoAgent(roles.randomPerson.address)
        ).to.be.revertedWith("DAO Agent already set");
      });
    });
  });
  context("DAO Agent address to be set is zero", function () {
    it("reverts", async function () {
      await expect(
        api3Pool
          .connect(roles.randomPerson)
          .setDaoAgent(ethers.constants.AddressZero)
      ).to.be.revertedWith("Invalid address");
    });
  });
});

describe("setClaimsManagerStatus", function () {
  context("Caller is DAO Agent", function () {
    it("sets claims manager status", async function () {
      // Set the DAO Agent
      await api3Pool
        .connect(roles.randomPerson)
        .setDaoAgent(roles.daoAgent.address);
      // Set claims manager status as true with the DAO Agent
      await expect(
        api3Pool
          .connect(roles.daoAgent)
          .setClaimsManagerStatus(roles.claimsManager.address, true)
      )
        .to.emit(api3Pool, "SetClaimsManagerStatus")
        .withArgs(roles.claimsManager.address, true);
      expect(
        await api3Pool.claimsManagerStatus(roles.claimsManager.address)
      ).to.equal(true);
      // Reset claims manager status as false with the DAO Agent
      await expect(
        api3Pool
          .connect(roles.daoAgent)
          .setClaimsManagerStatus(roles.claimsManager.address, false)
      )
        .to.emit(api3Pool, "SetClaimsManagerStatus")
        .withArgs(roles.claimsManager.address, false);
      expect(
        await api3Pool.claimsManagerStatus(roles.claimsManager.address)
      ).to.equal(false);
    });
  });
  context("Caller is not DAO Agent", function () {
    it("reverts", async function () {
      await expect(
        api3Pool
          .connect(roles.randomPerson)
          .setClaimsManagerStatus(roles.claimsManager.address, false)
      ).to.be.revertedWith("Unauthorized");
    });
  });
});

describe("payReward", function () {
  context("Reward for the previous epoch has not been paid", function () {
    context("Pool contract is authorized to mint tokens", function () {
      it("updates APR and pays reward", async function () {
        // Authorize pool contract to mint tokens
        await api3Token
          .connect(roles.deployer)
          .updateMinterStatus(api3Pool.address, true);
        // Have two users stake
        const user1Stake = ethers.utils.parseEther("10" + "000" + "000");
        const user2Stake = ethers.utils.parseEther("30" + "000" + "000");
        await api3Token
          .connect(roles.deployer)
          .transfer(roles.user1.address, user1Stake);
        await api3Token
          .connect(roles.deployer)
          .transfer(roles.user2.address, user2Stake);
        await api3Token
          .connect(roles.user1)
          .approve(api3Pool.address, user1Stake);
        await api3Token
          .connect(roles.user2)
          .approve(api3Pool.address, user2Stake);
        await api3Pool
          .connect(roles.user1)
          .depositAndStake(
            roles.user1.address,
            user1Stake,
            roles.user1.address
          );
        await api3Pool
          .connect(roles.user2)
          .depositAndStake(
            roles.user2.address,
            user2Stake,
            roles.user2.address
          );
        // Fast forward time to one epoch into the future
        const genesisEpoch = await api3Pool.genesisEpoch();
        const genesisEpochPlusOne = genesisEpoch.add(ethers.BigNumber.from(1));
        await ethers.provider.send("evm_setNextBlockTimestamp", [
          genesisEpochPlusOne
            .mul(ethers.BigNumber.from(7 * 24 * 60 * 60))
            .toNumber(),
        ]);
        // Pay reward
        const stakeTarget = await api3Pool.stakeTarget();
        const totalStake = await api3Pool.totalStake();
        const aprUpdateCoeff = await api3Pool.aprUpdateCoeff();
        const deltaAbsolute = totalStake.sub(stakeTarget); // Over target
        const deltaPercentage = deltaAbsolute
          .mul(hundredPercent)
          .div(stakeTarget);
        const aprUpdate = deltaPercentage.mul(aprUpdateCoeff).div(onePercent);
        const currentApr = await api3Pool.currentApr();
        const newApr = currentApr
          .mul(hundredPercent.sub(aprUpdate))
          .div(hundredPercent);
        const rewardAmount = totalStake
          .mul(newApr)
          .div(ethers.BigNumber.from(52))
          .div(hundredPercent);
        await expect(api3Pool.connect(roles.randomPerson).payReward())
          .to.emit(api3Pool, "PaidReward")
          .withArgs(genesisEpochPlusOne, rewardAmount, newApr);
        expect(await api3Pool.totalStake()).to.equal(
          totalStake.add(rewardAmount)
        );
        expect(await api3Pool.epochIndexOfLastRewardPayment()).to.equal(
          genesisEpochPlusOne
        );
        expect(await api3Pool.currentApr()).to.equal(newApr);
        const reward = await api3Pool.epochIndexToReward(genesisEpochPlusOne);
        expect(reward.atBlock).to.equal(await ethers.provider.getBlockNumber());
        expect(reward.amount).to.equal(rewardAmount);
      });
    });
    context("Pool contract is not authorized to mint tokens", function () {
      it("skips the payment and APR update", async function () {
        // Have two users stake
        const user1Stake = ethers.utils.parseEther("10" + "000" + "000");
        const user2Stake = ethers.utils.parseEther("30" + "000" + "000");
        await api3Token
          .connect(roles.deployer)
          .transfer(roles.user1.address, user1Stake);
        await api3Token
          .connect(roles.deployer)
          .transfer(roles.user2.address, user2Stake);
        await api3Token
          .connect(roles.user1)
          .approve(api3Pool.address, user1Stake);
        await api3Token
          .connect(roles.user2)
          .approve(api3Pool.address, user2Stake);
        await api3Pool
          .connect(roles.user1)
          .depositAndStake(
            roles.user1.address,
            user1Stake,
            roles.user1.address
          );
        await api3Pool
          .connect(roles.user2)
          .depositAndStake(
            roles.user2.address,
            user2Stake,
            roles.user2.address
          );
        // Fast forward time to one epoch into the future
        const genesisEpoch = await api3Pool.genesisEpoch();
        const genesisEpochPlusOne = genesisEpoch.add(ethers.BigNumber.from(1));
        await ethers.provider.send("evm_setNextBlockTimestamp", [
          genesisEpochPlusOne
            .mul(ethers.BigNumber.from(7 * 24 * 60 * 60))
            .toNumber(),
        ]);
        // Pay reward
        const totalStake = await api3Pool.totalStake();
        const currentApr = await api3Pool.currentApr();
        await api3Pool.connect(roles.randomPerson).payReward();
        expect(await api3Pool.totalStake()).to.equal(totalStake);
        expect(await api3Pool.epochIndexOfLastRewardPayment()).to.equal(
          genesisEpochPlusOne
        );
        expect(await api3Pool.currentApr()).to.equal(currentApr);
        const reward = await api3Pool.epochIndexToReward(genesisEpochPlusOne);
        expect(reward.atBlock).to.equal(0);
        expect(reward.amount).to.equal(0);
      });
    });
  });
  context("Rewards for multiple epochs have not been paid", function () {
    context("Pool contract is authorized to mint tokens", function () {
      it("updates APR and only pays the reward for the current epoch", async function () {
        // Authorize pool contract to mint tokens
        await api3Token
          .connect(roles.deployer)
          .updateMinterStatus(api3Pool.address, true);
        // Have two users stake
        const user1Stake = ethers.utils.parseEther("10" + "000" + "000");
        const user2Stake = ethers.utils.parseEther("30" + "000" + "000");
        await api3Token
          .connect(roles.deployer)
          .transfer(roles.user1.address, user1Stake);
        await api3Token
          .connect(roles.deployer)
          .transfer(roles.user2.address, user2Stake);
        await api3Token
          .connect(roles.user1)
          .approve(api3Pool.address, user1Stake);
        await api3Token
          .connect(roles.user2)
          .approve(api3Pool.address, user2Stake);
        await api3Pool
          .connect(roles.user1)
          .depositAndStake(
            roles.user1.address,
            user1Stake,
            roles.user1.address
          );
        await api3Pool
          .connect(roles.user2)
          .depositAndStake(
            roles.user2.address,
            user2Stake,
            roles.user2.address
          );
        // Fast forward time to one epoch into the future
        const genesisEpoch = await api3Pool.genesisEpoch();
        const genesisEpochPlusFive = genesisEpoch.add(ethers.BigNumber.from(5));
        await ethers.provider.send("evm_setNextBlockTimestamp", [
          genesisEpochPlusFive
            .mul(ethers.BigNumber.from(7 * 24 * 60 * 60))
            .toNumber(),
        ]);
        // Pay reward
        const stakeTarget = await api3Pool.stakeTarget();
        const totalStake = await api3Pool.totalStake();
        const aprUpdateCoeff = await api3Pool.aprUpdateCoeff();
        const deltaAbsolute = totalStake.sub(stakeTarget); // Over target
        const deltaPercentage = deltaAbsolute
          .mul(hundredPercent)
          .div(stakeTarget);
        const aprUpdate = deltaPercentage.mul(aprUpdateCoeff).div(onePercent);
        const currentApr = await api3Pool.currentApr();
        const newApr = currentApr
          .mul(hundredPercent.sub(aprUpdate))
          .div(hundredPercent);
        const rewardAmount = totalStake
          .mul(newApr)
          .div(ethers.BigNumber.from(52))
          .div(hundredPercent);
        await expect(api3Pool.connect(roles.randomPerson).payReward())
          .to.emit(api3Pool, "PaidReward")
          .withArgs(genesisEpochPlusFive, rewardAmount, newApr);
        expect(await api3Pool.totalStake()).to.equal(
          totalStake.add(rewardAmount)
        );
        expect(await api3Pool.epochIndexOfLastRewardPayment()).to.equal(
          genesisEpochPlusFive
        );
        expect(await api3Pool.currentApr()).to.equal(newApr);
        const reward = await api3Pool.epochIndexToReward(genesisEpochPlusFive);
        expect(reward.atBlock).to.equal(await ethers.provider.getBlockNumber());
        expect(reward.amount).to.equal(rewardAmount);
      });
      context("Pool contract is not authorized to mint tokens", function () {
        it("skips the payment and APR update", async function () {
          // Have two users stake
          const user1Stake = ethers.utils.parseEther("10" + "000" + "000");
          const user2Stake = ethers.utils.parseEther("30" + "000" + "000");
          await api3Token
            .connect(roles.deployer)
            .transfer(roles.user1.address, user1Stake);
          await api3Token
            .connect(roles.deployer)
            .transfer(roles.user2.address, user2Stake);
          await api3Token
            .connect(roles.user1)
            .approve(api3Pool.address, user1Stake);
          await api3Token
            .connect(roles.user2)
            .approve(api3Pool.address, user2Stake);
          await api3Pool
            .connect(roles.user1)
            .depositAndStake(
              roles.user1.address,
              user1Stake,
              roles.user1.address
            );
          await api3Pool
            .connect(roles.user2)
            .depositAndStake(
              roles.user2.address,
              user2Stake,
              roles.user2.address
            );
          // Fast forward time to one epoch into the future
          const genesisEpoch = await api3Pool.genesisEpoch();
          const genesisEpochPlusFive = genesisEpoch.add(
            ethers.BigNumber.from(5)
          );
          await ethers.provider.send("evm_setNextBlockTimestamp", [
            genesisEpochPlusFive
              .mul(ethers.BigNumber.from(7 * 24 * 60 * 60))
              .toNumber(),
          ]);
          // Pay reward
          const totalStake = await api3Pool.totalStake();
          const currentApr = await api3Pool.currentApr();
          await api3Pool.connect(roles.randomPerson).payReward();
          expect(await api3Pool.totalStake()).to.equal(totalStake);
          expect(await api3Pool.epochIndexOfLastRewardPayment()).to.equal(
            genesisEpochPlusFive
          );
          expect(await api3Pool.currentApr()).to.equal(currentApr);
          const reward = await api3Pool.epochIndexToReward(
            genesisEpochPlusFive
          );
          expect(reward.atBlock).to.equal(0);
          expect(reward.amount).to.equal(0);
        });
      });
    });
  });
  context("Reward for the current epoch has been paid", function () {
    it("does nothing", async function () {
      // Authorize pool contract to mint tokens
      await api3Token
        .connect(roles.deployer)
        .updateMinterStatus(api3Pool.address, true);
      // Have two users stake
      const user1Stake = ethers.utils.parseEther("10" + "000" + "000");
      const user2Stake = ethers.utils.parseEther("30" + "000" + "000");
      await api3Token
        .connect(roles.deployer)
        .transfer(roles.user1.address, user1Stake);
      await api3Token
        .connect(roles.deployer)
        .transfer(roles.user2.address, user2Stake);
      await api3Token
        .connect(roles.user1)
        .approve(api3Pool.address, user1Stake);
      await api3Token
        .connect(roles.user2)
        .approve(api3Pool.address, user2Stake);
      await api3Pool
        .connect(roles.user1)
        .depositAndStake(roles.user1.address, user1Stake, roles.user1.address);
      await api3Pool
        .connect(roles.user2)
        .depositAndStake(roles.user2.address, user2Stake, roles.user2.address);
      // Fast forward time to one epoch into the future
      const genesisEpoch = await api3Pool.genesisEpoch();
      const genesisEpochPlusOne = genesisEpoch.add(ethers.BigNumber.from(1));
      await ethers.provider.send("evm_setNextBlockTimestamp", [
        genesisEpochPlusOne
          .mul(ethers.BigNumber.from(7 * 24 * 60 * 60))
          .toNumber(),
      ]);
      // Pay reward
      await api3Pool.connect(roles.randomPerson).payReward();
      const totalStake = await api3Pool.totalStake();
      const epochIndexOfLastRewardPayment = await api3Pool.epochIndexOfLastRewardPayment();
      const currentApr = await api3Pool.currentApr();
      // Pay reward again
      await api3Pool.connect(roles.randomPerson).payReward();
      // Nothing should have changed
      expect(await api3Pool.totalStake()).to.equal(totalStake);
      expect(await api3Pool.epochIndexOfLastRewardPayment()).to.equal(
        epochIndexOfLastRewardPayment
      );
      expect(await api3Pool.currentApr()).to.equal(currentApr);
    });
  });
});

describe("getUserLockedAt", function () {
  context("User never updated before", function () {
    it("Resets the lock and accumulates the relevant locks", async function () {
      // Authorize pool contract to mint tokens
      await api3Token
        .connect(roles.deployer)
        .updateMinterStatus(api3Pool.address, true);
      // Have the user stake
      const user1Stake = ethers.utils.parseEther("30" + "000" + "000");
      await api3Token
        .connect(roles.deployer)
        .transfer(roles.user1.address, user1Stake);
      await api3Token
        .connect(roles.user1)
        .approve(api3Pool.address, user1Stake);
      await api3Pool
        .connect(roles.user1)
        .depositAndStake(roles.user1.address, user1Stake, roles.user1.address);
      // In the first `rewardVestingPeriod` epochs, all rewards starting from genesisEpoch will be locked
      const genesisEpoch = await api3Pool.genesisEpoch();
      const rewardVestingPeriod = (
        await api3Pool.rewardVestingPeriod()
      ).toNumber();
      for (let i = 0; i < rewardVestingPeriod + 1; i++) {
        const currentEpoch = genesisEpoch.add(ethers.BigNumber.from(i + 1));
        await ethers.provider.send("evm_setNextBlockTimestamp", [
          currentEpoch.mul(ethers.BigNumber.from(7 * 24 * 60 * 60)).toNumber(),
        ]);
        await api3Pool.payReward();
        const locked = await api3Pool.callStatic.getUserLockedAt(
          roles.user1.address,
          currentEpoch
        );
        const rewards = (await api3Pool.totalStake()).sub(user1Stake);
        // Need some tolerance for rounding errors
        expect(rewards.sub(locked).lt(ethers.BigNumber.from(100))).to.be.equal(
          true
        );
      }
      // ...then, only the last `rewardVestingPeriod` epochs will be locked
      for (
        let i = rewardVestingPeriod + 1;
        i < 2 * rewardVestingPeriod + 1;
        i++
      ) {
        const currentEpoch = genesisEpoch.add(ethers.BigNumber.from(i + 1));
        await ethers.provider.send("evm_setNextBlockTimestamp", [
          currentEpoch.mul(ethers.BigNumber.from(7 * 24 * 60 * 60)).toNumber(),
        ]);
        await api3Pool.payReward();
        const locked = await api3Pool.callStatic.getUserLockedAt(
          roles.user1.address,
          currentEpoch
        );
        const currentStake = await api3Pool.totalStake();
        const unlockEpoch = currentEpoch.sub(
          ethers.BigNumber.from(rewardVestingPeriod + 1)
        );
        const reward = await api3Pool.epochIndexToReward(unlockEpoch);
        const unlockEpochStake = await api3Pool.totalStakeAt(reward.atBlock);
        // Need some tolerance for rounding errors
        expect(
          currentStake
            .sub(unlockEpochStake)
            .sub(locked)
            .lt(ethers.BigNumber.from(100))
        ).to.be.equal(true);
      }
    });
  });
});
