//SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "./ITimelockUtils.sol";

interface IGovernanceUtils is ITimelockUtils {
    event SetStakeTarget(
        uint256 oldTarget,
        uint256 newTarget
        );

    event SetMaxApr(
        uint256 oldMax,
        uint256 newMax
        );

    event SetMinApr(
        uint256 oldMin,
        uint256 newMin
        );

    event SetUnstakeWaitPeriod(
        uint256 oldPeriod,
        uint256 newPeriod
        );

    event SetAprUpdateCoefficient(
        uint256 oldCoeff,
        uint256 newCoeff
        );

    event SetClaimsManagerStatus(
        address claimsManager,
        bool status
        );

    event PublishedSpecsUrl(
        uint256 proposalIndex,
        address userAddress,
        string specsUrl
        );

    function setStakeTarget(uint256 _stakeTarget)
        external;

    function setMaxApr(uint256 _maxApr)
        external;

    function setMinApr(uint256 _minApr)
        external;

    function setUnstakeWaitPeriod(uint256 _unstakeWaitPeriod)
        external;

    function setUpdateCoefficient(uint256 _aprUpdateCoeff)
        external;

    function publishSpecsUrl(
        uint256 proposalIndex,
        string calldata specsUrl
        )
        external;
}
