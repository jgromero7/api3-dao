//SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "./DelegationUtils.sol";
import "./interfaces/ITransferUtils.sol";
import "hardhat/console.sol";

/// @title Contract that implements token transfer functionality
contract TransferUtils is DelegationUtils, ITransferUtils {
    /// @param api3TokenAddress API3 token contract address
    constructor(address api3TokenAddress)
        DelegationUtils(api3TokenAddress)
        public
    {}

    /// @notice Called to deposit tokens for a user by using `transferFrom()`
    /// @dev This method is used by `TimelockManager.sol`
    /// @param source Token transfer source
    /// @param amount Amount to be deposited
    /// @param userAddress User that the tokens will be deposited for
    function deposit(
        address source,
        uint256 amount,
        address userAddress
        )
        public
        override
    {
        users[userAddress].unstaked = users[userAddress].unstaked.add(amount);
        api3Token.transferFrom(source, address(this), amount);
        emit Deposited(
            userAddress,
            amount
            );
    }

    /// @notice Called to withdraw tokens
    /// @dev The user should call `getUserLockedAt()` beforehand to ensure that
    /// they have at least `amount` unlocked tokens to withdraw
    /// @param destination Token transfer destination
    /// @param amount Amount to be withdrawn
    function withdraw(
        address destination,
        uint256 amount
        )
        public
        override
    {
        // Since the following operation depends on the number of locked tokens
        // of the user, update that first
        uint256 currentEpoch = now.div(epochLength);
        User storage user = users[msg.sender];
        if (user.lastUpdateEpoch != currentEpoch) {
            updateUserLocked(msg.sender, currentEpoch);
        }
        // Check if the user has `amount` unlocked tokens to withdraw
        uint256 lockedAndVesting = user.locked.add(user.vesting);
        uint256 userTotalFunds = user.unstaked.add(userStake(msg.sender));
        require(userTotalFunds >= lockedAndVesting.add(amount), ERROR_VALUE);
        // Carry on with the withdrawal
        require(user.unstaked >= amount, ERROR_VALUE);
        user.unstaked = user.unstaked.sub(amount);
        api3Token.transfer(destination, amount);
        emit Withdrawn(msg.sender,
            destination,
            amount
            );
    }
}
