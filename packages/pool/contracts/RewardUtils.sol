//SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "./GetterUtils.sol";
import "./interfaces/IRewardUtils.sol";

/// @title Contract that implements reward payments and locks
contract RewardUtils is GetterUtils, IRewardUtils {
    /// @dev Pays the epoch reward before the modified function
    modifier payEpochRewardBefore {
        payReward();
        _;
    }

    /// @param api3TokenAddress API3 token contract address
    constructor(address api3TokenAddress)
        GetterUtils(api3TokenAddress)
        public
    {}

    /// @notice Updates the current APR
    /// @dev Called internally before paying out the reward
    /// @param totalStakedNow Current total number of tokens staked at the pool
    function updateCurrentApr(uint256 totalStakedNow)
        internal
    {
        if (stakeTarget == 0) {
            currentApr = minApr;
            return;
        }
        // Calculate what % we are off from the target
        uint256 deltaAbsolute = totalStakedNow < stakeTarget 
            ? stakeTarget.sub(totalStakedNow)
            : totalStakedNow.sub(stakeTarget);
        uint256 deltaPercentage = deltaAbsolute.mul(hundredPercent).div(stakeTarget);
        // Use the update coefficient to calculate what % we need to update
        // the APR with
        uint256 aprUpdate = deltaPercentage.mul(aprUpdateCoefficient).div(onePercent);

        uint256 newApr;
        if (totalStakedNow < stakeTarget) {
            newApr = currentApr.mul(hundredPercent.add(aprUpdate)).div(hundredPercent);
        }
        else {
            newApr = hundredPercent > aprUpdate
                ? currentApr.mul(hundredPercent.sub(aprUpdate)).div(hundredPercent)
                : 0;
        }

        if (newApr < minApr) {
            currentApr = minApr;
        }
        else if (newApr > maxApr) {
            currentApr = maxApr;
        }
        else {
            currentApr = newApr;
        }
    }

    /// @notice Called to pay the reward for the current epoch
    /// @dev Skips past epochs for which rewards have not been paid for.
    /// Skips the reward payment if the pool is not authorized to mint tokens.
    /// Neither of these conditions will occur in practice.
    function payReward()
        public
        override
    {
        uint256 currentEpoch = now.div(epochLength);
        // This will be skipped in most cases because someone else will have
        // triggered the payment for this epoch
        if (epochIndexOfLastRewardPayment < currentEpoch)
        {
            if (api3Token.getMinterStatus(address(this)))
            {
                uint256 totalStakedNow = getValue(totalStaked);
                updateCurrentApr(totalStakedNow);
                uint256 rewardAmount = totalStakedNow.mul(currentApr).div(rewardVestingPeriod).div(hundredPercent);
                epochIndexToReward[currentEpoch] = Reward({
                    atBlock: block.number,
                    amount: rewardAmount
                    });
                if (rewardAmount > 0) {
                    api3Token.mint(address(this), rewardAmount);
                    totalStaked.push(Checkpoint({
                        fromBlock: block.number,
                        value: totalStakedNow.add(rewardAmount)
                        }));
                }
                emit PaidReward(
                    currentEpoch,
                    rewardAmount,
                    currentApr
                    );
            }
            epochIndexOfLastRewardPayment = currentEpoch;
        }
    }

    /// @notice Updates the locked tokens of the user
    /// @dev The user has to update their locked tokens up to the current epoch
    /// before withdrawing. In case this costs too much gas, this method
    /// accepts a `targetEpoch` parameter for the user to be able to make this
    /// update through multiple transactions.
    /// @param userAddress User address
    /// @param targetEpoch Epoch index until which the locked tokens will be
    /// updated
    function updateUserLocked(
        address userAddress,
        uint256 targetEpoch
        )
        public
        override
    {
        uint256 newLocked = getUserLockedAt(userAddress, targetEpoch);
        User storage user = users[userAddress];
        user.locked = newLocked;
        user.oldestLockedEpoch = getOldestLockedEpoch();
        user.lastUpdateEpoch = targetEpoch;
        emit UpdatedUserLocked(
            userAddress,
            targetEpoch,
            newLocked
            );
    }

    /// @notice Called to get the locked tokens of the user at a specific epoch
    /// @param userAddress User address
    /// @param targetEpoch Epoch index for which the locked tokens will be
    /// returned
    /// @return Locked tokens of the user at the epoch
    function getUserLockedAt(
        address userAddress,
        uint256 targetEpoch
        )
        public
        override
        payEpochRewardBefore()
        returns(uint256)
    {
        uint256 currentEpoch = now.div(epochLength);
        uint256 oldestLockedEpoch = getOldestLockedEpoch();
        User storage user = users[userAddress];
        uint256 lastUpdateEpoch = user.lastUpdateEpoch;
        require(targetEpoch <= currentEpoch
            && targetEpoch >= lastUpdateEpoch
            && targetEpoch >= oldestLockedEpoch,
            ERROR_VALUE
            );
        // If the last update is way in the past, we can just reset all locked
        // and lock back rewards paid in the last `rewardVestingPeriod`
        if (lastUpdateEpoch < oldestLockedEpoch) {
            uint256 locked = 0;
            for (
                uint256 ind = oldestLockedEpoch;
                ind <= targetEpoch;
                ind = ind.add(1)
            ) {
                Reward storage lockedReward = epochIndexToReward[ind];
                if (lockedReward.atBlock != 0)
                {
                    uint256 totalSharesThen = getValueAt(totalShares, lockedReward.atBlock);
                    uint256 userSharesThen = getValueAt(user.shares, lockedReward.atBlock);
                    locked = locked.add(lockedReward.amount.mul(userSharesThen).div(totalSharesThen));
                }
            }
            return locked;
        }
        // ...otherwise, start by locking the rewards since the last update
        uint256 locked = user.locked;
        for (
            uint256 ind = lastUpdateEpoch.add(1);
            ind <= targetEpoch;
            ind = ind.add(1)
        ) {
            Reward storage lockedReward = epochIndexToReward[ind];
            if (lockedReward.atBlock != 0)
            {
                uint256 totalSharesThen = getValueAt(totalShares, lockedReward.atBlock);
                uint256 userSharesThen = getValueAt(user.shares, lockedReward.atBlock);
                locked = locked.add(lockedReward.amount.mul(userSharesThen).div(totalSharesThen));
            }
        }
        // ...then unlock the rewards that have matured (if applicable)
        if (targetEpoch >= genesisEpoch.add(rewardVestingPeriod)) {
            for (
                uint256 ind = user.oldestLockedEpoch;
                ind <= oldestLockedEpoch.sub(1);
                ind = ind.add(1)
            ) {
                Reward storage unlockedReward = epochIndexToReward[ind.sub(rewardVestingPeriod)];
                if (unlockedReward.atBlock != 0)
                {
                    uint256 totalSharesThen = getValueAt(totalShares, unlockedReward.atBlock);
                    uint256 userSharesThen = getValueAt(user.shares, unlockedReward.atBlock);
                    uint256 toUnlock = unlockedReward.amount.mul(userSharesThen).div(totalSharesThen);
                    // `locked` has a risk of underflowing due to the reward
                    // revocations during scheduling unstakes, which is why we
                    // clip it at 0
                    locked = locked > toUnlock
                        ? locked.sub(toUnlock)
                        : 0;
                }
            }
        }
        return locked;
    }

    /// @notice Called to get the current locked tokens of the user
    /// @dev This can be called statically by clients (e.g., the DAO dashboard)
    /// to get the locked tokens of the user without actually updating it
    /// @param userAddress User address
    /// @return Current locked tokens of the user
    function getUserLocked(address userAddress)
        external
        override
        returns(uint256)
    {
        return getUserLockedAt(userAddress, now.div(epochLength));
    }

    /// @notice Called to get the index of the oldest epoch whose reward is
    /// still locked
    /// @return Index of the oldest epoch whose reward is still locked
    function getOldestLockedEpoch()
        internal
        view
        returns(uint256)
    {
        uint256 currentEpoch = now.div(epochLength);
        return currentEpoch >= genesisEpoch.add(rewardVestingPeriod)
            ? currentEpoch.sub(rewardVestingPeriod)
            : genesisEpoch;
    }
}
