//SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "./StateUtils.sol";
import "./interfaces/IGetterUtils.sol";

/// @title Contract that implements getters
contract GetterUtils is StateUtils, IGetterUtils {
    /// @param api3TokenAddress API3 token contract address
    constructor(address api3TokenAddress)
        StateUtils(api3TokenAddress)
        public
    {}

    /// @notice Called to get the pool shares of a user at a specific block
    /// @param fromBlock Block number for which the query is being made for
    /// @param userAddress User address
    /// @return Pool shares of the user at the block
    function sharesAt(
        uint256 fromBlock,
        address userAddress
        )
        public
        view
        override
        returns(uint256)
    {
        return getValueAt(users[userAddress].shares, fromBlock);
    }

    /// @notice Called to get the current pool shares of a user
    /// @param userAddress User address
    /// @return Current pool shares of the user
    function shares(address userAddress)
        public
        view
        override
        returns(uint256)
    {
        return sharesAt(block.number, userAddress);
    }

    /// @notice Called to get the voting power delegated to a user at a
    /// specific block
    /// @param fromBlock Block number for which the query is being made for
    /// @param userAddress User address
    /// @return Voting power delegated to the user at the block
    function delegatedToAt(
        uint256 fromBlock,
        address userAddress
        )
        public
        view
        override
        returns(uint256)
    {
        return getValueAt(users[userAddress].delegatedTo, fromBlock);
    }

    /// @notice Called to get the current voting power delegated to a user
    /// @param userAddress User address
    /// @return Current voting power delegated to the user
    function delegatedTo(address userAddress)
        public
        view
        override
        returns(uint256)
    {
        return delegatedToAt(block.number, userAddress);
    }

    /// @notice Called to check if the user is delegating at a specific block
    /// @param userAddress User address
    /// @param _block Block number
    /// @return Whether the user is delegating at the specific block
    function userDelegatingAt(
        address userAddress,
        uint256 _block
        )
        public
        view
        override
        returns(bool)
    {
        address userDelegateAt = getAddressAt(users[userAddress].delegates, _block);
        return userDelegateAt != address(0);
    }

    /// @notice Called to check if the user is currently delegating
    /// @param userAddress User address
    /// @return Whether the user is currently delegating
    function userDelegating(address userAddress)
        public
        view
        override
        returns(bool)
    {
        return userDelegatingAt(userAddress, block.number);
    }

    /// @notice Called to get the voting power of a user at a specific block
    /// @dev This method is used to implement the MiniMe interface for the
    /// Aragon Voting app
    /// @param fromBlock Block number for which the query is being made for
    /// @param userAddress User address
    /// @return Voting power of the user at the block
    function balanceOfAt(
        uint256 fromBlock,
        address userAddress
        )
        public
        view
        override
        returns(uint256)
    {
        // Users that delegate have no voting power
        if (userDelegatingAt(userAddress, fromBlock)) {
            return 0;
        }
        uint256 userSharesThen = sharesAt(fromBlock, userAddress);
        uint256 delegatedToUserThen = delegatedToAt(fromBlock, userAddress);
        return userSharesThen.add(delegatedToUserThen);
    }

    /// @notice Called to get the current voting power of a user
    /// @dev This method is used to implement the MiniMe interface for the
    /// Aragon Voting app
    /// @param userAddress User address
    /// @return Current voting power of the user
    function balanceOf(address userAddress)
        public
        view
        override
        returns(uint256)
    {
        return balanceOfAt(block.number, userAddress);
    }

    /// @notice Called to get the current staked tokens of the user
    /// @param userAddress User address
    /// @return Current staked tokens of the user
    function userStaked(address userAddress)
        public
        view
        override
        returns(uint256)
    {
        return shares(userAddress).mul(totalStake()).div(totalSupply());
    }

    /// @notice Called to get the total voting power at a specific block
    /// @dev This method is used to implement the MiniMe interface for the
    /// Aragon Voting app
    /// @param fromBlock Block number for which the query is being made for
    /// @return Total voting power at the block
    function totalSupplyAt(uint256 fromBlock)
        public
        view
        override
        returns(uint256)
    {
        return getValueAt(totalShares, fromBlock);
    }

    /// @notice Called to get the current total voting power
    /// @dev This method is used to implement the MiniMe interface for the
    /// Aragon Voting app
    /// @return Current total voting power
    function totalSupply()
        public
        view
        override
        returns(uint256)
    {
        return totalSupplyAt(block.number);
    }

    /// @notice Called to get the total staked tokens at a specific block
    /// @param fromBlock Block number for which the query is being made for
    /// @return Total staked tokens at the block
    function totalStakeAt(uint256 fromBlock)
        public
        view
        override
        returns(uint256)
    {
        return getValueAt(totalStaked, fromBlock);
    }

    /// @notice Called to get the current total staked tokens
    /// @return Current total staked tokens
    function totalStake()
        public
        view
        override
        returns(uint256)
    {
        return totalStakeAt(block.number);
    }
}
