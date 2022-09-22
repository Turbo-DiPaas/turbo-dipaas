// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

contract Storage {
    uint256 number;

    event ValueStored(address, uint256);
    event ValueIncremented(address, uint256);

    function store(uint256 num) public {
        number = num;
        emit ValueStored(msg.sender, num);
    }

    function retrieve() public view returns (uint256){
        return number;
    }

    function increment() public {
        number += 1;
        emit ValueIncremented(msg.sender, number);
    }
}

