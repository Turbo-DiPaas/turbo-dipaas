// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

contract Storage {
    uint256 number;

    event ValueStored(address, uint256);
    event ValueIncremented(address, uint256);
    event FundsReceived(address, uint256);
    event FundsClaimed(address, uint256);

    function store(uint256 num) public {
        number = num;
        emit ValueStored(msg.sender, num);
    }

    function testMultiple(uint256 num, uint256 num2) public {
        number = num + num2;
        emit ValueStored(msg.sender, num);
    }

    function retrieve() public view returns (uint256){
        return number;
    }

    function increment() public {
        number += 1;
        emit ValueIncremented(msg.sender, number);
    }

    function receiveFunds() public payable {
        emit FundsReceived(msg.sender, msg.value);
    }

    function claimFunds() public {
        uint fundsToClaim = address(this).balance;
        (bool sent,) = msg.sender.call{value: fundsToClaim}("");
        require(sent, "Failed to send Ether");

        emit FundsClaimed(msg.sender, fundsToClaim);
    }
}


