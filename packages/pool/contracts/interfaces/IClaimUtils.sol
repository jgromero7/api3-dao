//SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "./IStakeUtils.sol";

interface IClaimUtils is IStakeUtils {
    event ClaimPayout(
        uint256 indexed claimBlock,
        uint256 amount
        );

    function payOutClaim(uint256 amount)
        external;
}
