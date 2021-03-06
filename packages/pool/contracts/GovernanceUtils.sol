pragma solidity 0.6.12;

import "./TimelockUtils.sol";

contract GovernanceUtils is TimelockUtils {
    constructor(address api3TokenAddress)
        TimelockUtils(api3TokenAddress)
        public
    {}

    event NewStakeTarget(uint256 oldTarget, uint256 newTarget);
    event NewMaxApr(uint256 oldMax, uint256 newMax);
    event NewMinApr(uint256 oldMin, uint256 newMin);
    event NewUnstakeWaitPeriod(uint256 oldPeriod, uint256 newPeriod);
    event NewUpdateCoefficient(uint256 oldCoeff, uint256 newCoeff);
    event NewClaimsManager(address oldClaimsManager, address claimsManager);

    function setStakeTarget(uint256 _stakeTarget)
        external triggerEpochAfter
        //onlyDao
    {
        uint256 oldTarget = stakeTarget;
        stakeTarget = _stakeTarget;
        emit NewStakeTarget(oldTarget, stakeTarget);
    }

    function setMaxApr(uint256 _maxApr)
        external triggerEpochAfter
        //onlyDao
    {
        require(_maxApr >= minApr, "Invalid value");
        uint256 oldMax = maxApr;
        maxApr = _maxApr;
        emit NewMaxApr(oldMax, maxApr);
    }

    function setMinApr(uint256 _minApr)
        external triggerEpochAfter
        //onlyDao
    {
        require(_minApr <= maxApr, "Invalid value");
        uint256 oldMin = minApr;
        minApr = _minApr;
        emit NewMinApr(oldMin, minApr);
    }

    function setUnstakeWaitPeriod(uint256 _unstakeWaitPeriod)
        external
        //onlyDao
    {
        require(_unstakeWaitPeriod <= 7776000 && _unstakeWaitPeriod >= 604800, "Invalid value");
        uint256 oldPeriod = unstakeWaitPeriod;
        unstakeWaitPeriod = _unstakeWaitPeriod;
        emit NewUnstakeWaitPeriod(oldPeriod, unstakeWaitPeriod);
    }

    function setUpdateCoefficient(uint256 _updateCoeff)
        external triggerEpochAfter
        //onlyDao
    {
        require(_updateCoeff < 1000000000 && _updateCoeff > 0, "Invalid value");
        uint256 oldCoeff = updateCoeff;
        updateCoeff = _updateCoeff;
        emit NewUpdateCoefficient(oldCoeff, updateCoeff);
    }

    function setClaimsManager(address _claimsManager)
        external
        //onlyDao
    {
        address oldClaimsManager = claimsManager;
        claimsManager = _claimsManager;
        emit NewClaimsManager(oldClaimsManager, claimsManager);
    }
}