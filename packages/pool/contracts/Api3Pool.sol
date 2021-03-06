//SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "./GovernanceUtils.sol";

/// @title API3 pool contract
/// @notice Users can stake API3 tokens at the pool contract to be granted
/// shares. These shares are exposed to the Aragon-based DAO with a MiniMe
/// token interface, giving the user voting power at the DAO. Staking pays out
/// weekly rewards that get unlocked after a year, and staked funds are used to
/// collateralize an insurance product that is outside the scope of this
/// contract.
/// @dev The different functionalities of the contract are distributed to files
/// that are inherited as a chain:
/// (1) Api3Pool.sol
/// (2) GovernanceUtils.sol
/// (3) TimelockUtils.sol
/// (4) ClaimUtils.sol
/// (5) StakeUtils.sol
/// (6) TransferUtils.sol
/// (7) GetterUtils.sol
/// (8) DelegationUtils.sol
/// (9) StateUtils.sol
contract Api3Pool is GovernanceUtils {
    /// @param api3TokenAddress API3 token contract address
    constructor(address api3TokenAddress)
        GovernanceUtils(api3TokenAddress)
        public
    {}
}
