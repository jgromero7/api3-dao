//SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "./IStateUtils.sol";

interface IGetterUtils is IStateUtils {
    function sharesAt(
        uint256 fromBlock,
        address userAddress
        )
        external
        view
        returns(uint256);

    function shares(address userAddress)
        external
        view
        returns(uint256);

    function delegatedToAt(
        uint256 fromBlock,
        address userAddress
        )
        external
        view
        returns(uint256);

    function delegatedTo(address userAddress)
        external
        view
        returns(uint256);

    function userDelegatingAt(
        address userAddress,
        uint256 _block
        )
        external
        view
        returns(bool);

    function userDelegating(address userAddress)
        external
        view
        returns(bool);

    function balanceOfAt(
        uint256 fromBlock,
        address userAddress
        )
        external
        view
        returns(uint256);

    function balanceOf(address userAddress)
        external
        view
        returns(uint256);

    function userStaked(address userAddress)
        external
        view
        returns(uint256);

    function totalSupplyAt(uint256 fromBlock)
        external
        view
        returns(uint256);

    function totalSupply()
        external
        view
        returns(uint256);

    function totalStakeAt(uint256 fromBlock)
        external
        view
        returns(uint256);

    function totalStake()
        external
        view
        returns(uint256);
}
