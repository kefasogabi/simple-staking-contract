pragma solidity >=0.4.22 <0.9.0;

import "./DaiToken.sol";
import "./DappToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;
    
    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    //mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    //  Stake Tokenss
    function stakeTokens(uint _amount) public {
        require(_amount > 0, "amount cannot be 0");

        // Transfer Mock Dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        //Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add user to stakers array *only* if they haven't staked before
        pushAddress(msg.sender);

        // Update Staking status
        isStaking[msg.sender] = true;
        // hasStaked[msg.sender] = true;
    }

    //  Unstakeing Tokens

    function unstakeTokens(uint _amount) public {

        // Fetch staking balance
         uint balance = stakingBalance[msg.sender];

        require(_amount <= balance, "amount cannot be greater than balance");
        
        // Require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");

        // Transfer Mock Dai tokens to this contract for stating
        daiToken.transfer(msg.sender, _amount);

        // Reset staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] - _amount;

         // remove user from stakers array *only* if they has staked before
         if(stakingBalance[msg.sender] == 0){
              removeAddress(msg.sender);
               isStaking[msg.sender] = false;
         }
       

        // Update staking status
       
        // hasStaked[msg.sender] = false;
    }

    //  Issuing Tokens
    function issueTokens() public {
        // Only owner can call this function
        require(msg.sender == owner, "only owner can perform this operation");

        // Issue tokens to all stakers 
        for(uint i = 0; i < stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0){
                dappToken.transfer(recipient, balance);
            }
                
        }
    }

    function exists(address element) internal view returns (bool) {
        for (uint i = 0; i < stakers.length; i++) {
            if (stakers[i] == element) {
                return true;
            }
        }
        return false;
    }

    function pushAddress(address element) internal {
        if(!exists(element)){
            stakers.push(element);
        }
    }

    function removeAddress(address element) internal returns (bool) {
        for (uint i = 0; i < stakers.length; i++) {
            if (stakers[i] == element) {
                stakers[i] = stakers[stakers.length - 1];
                stakers.pop();
                return true;
            }
        }
        return false;
    }
}