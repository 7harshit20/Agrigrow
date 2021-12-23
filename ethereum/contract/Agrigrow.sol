// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

contract AgrigrowRoot {
    mapping(address=>address) addressList;

    function createSellerContract() public {
        Agrigrow sellerContract = new Agrigrow(msg.sender);
        addressList[msg.sender] = address(sellerContract);
    }

    function getContactAddress(address seller) public view returns(address){
        return addressList[seller];
    }
}

contract Agrigrow {
    address public manager;

    modifier onlyManager(){
        require(msg.sender == manager, "only seller can withdraw money");
        _;
    }

    constructor(address seller){
        manager = seller;
    }    

    function pay(uint256 due) public payable {
        require(msg.value == due, "enter exact amount to be paid");
    }

    function withdraw(uint256 payment) public onlyManager {
        require(address(this).balance >= payment, "the buyer has not paid the bill yet" );
        payable(manager).transfer(payment);
    }

}
    