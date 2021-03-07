//SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

interface IRewardUtils {
    event PaidReward(
        uint256 indexed epoch,
        uint256 rewardAmount,
        uint256 apr
        );

    event UpdatedUserLocked(
        address indexed user,
        uint256 toEpoch,
        uint256 locked
        );

    function payReward()
        external;

    function updateUserLocked(
        address userAddress,
        uint256 targetEpoch
        )
        external;

    function getUserLockedAt(
        address userAddress,
        uint256 targetEpoch
        )
        external
        returns(uint256);

    function getUserLocked(address userAddress)
        external
        returns(uint256);
}
