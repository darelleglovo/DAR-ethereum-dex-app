pragma solidity ^0.8.11;

import "./Token.sol";

contract EthSwapApp {
    string public name = "EthSwapApp Instant Exchange";
    Token public token;
    uint public rate = 100;

    event TokensPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        // redemption rate = # of tokens they recieve for 1 Ether
        // Amount of Ethereum * redemption rate
        uint tokenAmount = msg.value * rate;

        // EthSwapApp balance should be greater than or equal to the amount of tokens that is being purchased
        require(token.balanceOf(address(this)) >= tokenAmount);

        // then transfer the token to user
        token.transfer(msg.sender, tokenAmount);

        // Emit an event
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _tokenAmount) public {
        // User can't sell more tokens than they have
        require(token.balanceOf(msg.sender) >= _tokenAmount);

        // Calculate the amount of Ether to redeem
        uint etherAmount = _tokenAmount / rate;

        // EtherSwapApp should have enought Ether
        require(address(this).balance >= etherAmount);

        // Perform sale
        token.transferFrom(msg.sender, address(this), _tokenAmount);
        payable(msg.sender).transfer(etherAmount);

        emit TokensSold(msg.sender, address(token), _tokenAmount, rate);
    }
}
