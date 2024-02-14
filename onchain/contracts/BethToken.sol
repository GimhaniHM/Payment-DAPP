// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BethToken is ERC20 {

    address payable public owner; //Initialize the owner of the contract to eb deployed
    constructor() ERC20("BethToken", "KKK") {
        owner = payable(msg.sender);    //declare the owner of the contract

        // Mints 100,000 tokens to the contract to be deployed
        _mint(owner, 1000000 * (10 ** uint256(decimals())));
        // _mint(owner, initialSuply);
    }
}