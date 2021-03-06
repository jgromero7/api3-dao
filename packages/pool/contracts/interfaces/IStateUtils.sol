//SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

interface IStateUtils {
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

    event SetDaoAgent(address daoAgent);

    event SetClaimsManagerStatus(
        address claimsManager,
        bool status
        );

    function setDaoAgent(address _daoAgent)
        external;

    function setClaimsManagerStatus(
        address claimsManager,
        bool status
        )
        external;

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
