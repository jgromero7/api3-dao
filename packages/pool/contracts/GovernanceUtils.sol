//SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "./TimelockUtils.sol";
import "./interfaces/IGovernanceUtils.sol";

/// @title Contract that implements governance of DAO parameters
contract GovernanceUtils is TimelockUtils, IGovernanceUtils {
    /// @param api3TokenAddress API3 token contract address
    constructor(address api3TokenAddress)
        TimelockUtils(api3TokenAddress)
        public
    {}

    /// @notice Called by the DAO Agent to set the stake target
    /// @param _stakeTarget Stake target
    function setStakeTarget(uint256 _stakeTarget)
        external
        override
        onlyDaoAgent()
    {
        uint256 oldTarget = stakeTarget;
        stakeTarget = _stakeTarget;
        emit SetStakeTarget(oldTarget, stakeTarget);
    }

    /// @notice Called by the DAO Agent to set the maximum APR
    /// @param _maxApr Maximum APR
    function setMaxApr(uint256 _maxApr)
        external
        override
        onlyDaoAgent()
    {
        require(_maxApr >= minApr, "Invalid value");
        uint256 oldMax = maxApr;
        maxApr = _maxApr;
        emit SetMaxApr(oldMax, maxApr);
    }

    /// @notice Called by the DAO Agent to set the minimum APR
    /// @param _minApr Minimum APR
    function setMinApr(uint256 _minApr)
        external
        override
        onlyDaoAgent()
    {
        require(_minApr <= maxApr, "Invalid value");
        uint256 oldMin = minApr;
        minApr = _minApr;
        emit SetMinApr(oldMin, minApr);
    }

    /// @notice Called by the DAO Agent to set the unstake waiting period
    /// @dev This may want to be increased to provide more time for insurance
    /// claims to be resolved.
    /// Even when the insurance functionality is not implemented, the minimum
    /// valid value is `epochLength` to prevent users from unstaking,
    /// withdrawing and staking with another address to work around the
    /// proposal spam protection.
    /// @param _unstakeWaitPeriod Unstake waiting period
    function setUnstakeWaitPeriod(uint256 _unstakeWaitPeriod)
        external
        override
        onlyDaoAgent()
    {
        require(_unstakeWaitPeriod <= 7776000 && _unstakeWaitPeriod >= epochLength, "Invalid value");
        uint256 oldPeriod = unstakeWaitPeriod;
        unstakeWaitPeriod = _unstakeWaitPeriod;
        emit SetUnstakeWaitPeriod(oldPeriod, unstakeWaitPeriod);
    }

    /// @notice Called by the DAO Agent to set the APR update coefficient
    /// @param _aprUpdateCoeff APR update coefficient
    function setUpdateCoefficient(uint256 _aprUpdateCoeff)
        external
        override
        onlyDaoAgent()
    {
        require(_aprUpdateCoeff < 1000000000 && _aprUpdateCoeff > 0, "Invalid value");
        uint256 oldCoeff = aprUpdateCoeff;
        aprUpdateCoeff = _aprUpdateCoeff;
        emit SetAprUpdateCoefficient(oldCoeff, aprUpdateCoeff);
    }
}
