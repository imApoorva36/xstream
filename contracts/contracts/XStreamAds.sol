// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title XStreamAds
 * @dev Minimal advertisement contract for xStream platform
 * @notice Campaign data is stored off-chain in the database
 */
contract XStreamAds is ReentrancyGuard, Ownable, Pausable {
    // State variables
    mapping(address => uint256) public advertiserBalances;
    mapping(address => uint256) public userRewards;

    uint256 public platformFeePercentage = 10; // 10% platform fee on ads
    uint256 public constant PERCENTAGE_BASE = 100;

    address public treasuryAddress;

    // Events
    event AdBudgetDeposited(address indexed advertiser, uint256 amount);
    event AdViewed(address indexed viewer, uint256 reward, string campaignId);
    event BudgetWithdrawn(address indexed advertiser, uint256 amount);
    event RewardsWithdrawn(address indexed user, uint256 amount);

    constructor(address _treasuryAddress) {
        treasuryAddress = _treasuryAddress;
    }

    /**
     * @dev Deposit advertising budget
     */
    function depositAdBudget() external payable whenNotPaused {
        require(msg.value > 0, "Must deposit positive amount");
        advertiserBalances[msg.sender] += msg.value;
        emit AdBudgetDeposited(msg.sender, msg.value);
    }

    /**
     * @dev Process ad view and reward user
     * @param _viewer User who viewed the ad
     * @param _advertiser Advertiser who pays for the view
     * @param _reward Reward amount for viewing
     * @param _campaignId Campaign ID from database
     */
    function processAdView(
        address _viewer,
        address _advertiser,
        uint256 _reward,
        string memory _campaignId
    ) external onlyOwner whenNotPaused {
        require(
            advertiserBalances[_advertiser] >= _reward,
            "Insufficient advertiser balance"
        );

        // Deduct from advertiser balance
        advertiserBalances[_advertiser] -= _reward;

        // Calculate platform fee and user reward
        uint256 platformFee = (_reward * platformFeePercentage) /
            PERCENTAGE_BASE;
        uint256 userReward = _reward - platformFee;

        // Add reward to user balance
        userRewards[_viewer] += userReward;

        // Transfer platform fee to treasury
        if (platformFee > 0) {
            payable(treasuryAddress).transfer(platformFee);
        }

        emit AdViewed(_viewer, userReward, _campaignId);
    }

    /**
     * @dev Withdraw advertiser budget
     * @param _amount Amount to withdraw
     */
    function withdrawAdBudget(uint256 _amount) external nonReentrant {
        require(
            advertiserBalances[msg.sender] >= _amount,
            "Insufficient balance"
        );

        advertiserBalances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);

        emit BudgetWithdrawn(msg.sender, _amount);
    }

    /**
     * @dev Withdraw user rewards from watching ads
     */
    function withdrawRewards() external nonReentrant {
        uint256 rewards = userRewards[msg.sender];
        require(rewards > 0, "No rewards to withdraw");

        userRewards[msg.sender] = 0;
        payable(msg.sender).transfer(rewards);

        emit RewardsWithdrawn(msg.sender, rewards);
    }

    // View Functions
    function getAdvertiserBalance(
        address _advertiser
    ) external view returns (uint256) {
        return advertiserBalances[_advertiser];
    }

    function getUserRewards(address _user) external view returns (uint256) {
        return userRewards[_user];
    }

    // Admin Functions
    function setPlatformFee(uint256 _newFeePercentage) external onlyOwner {
        require(_newFeePercentage <= 20, "Fee cannot exceed 20%");
        platformFeePercentage = _newFeePercentage;
    }

    function setTreasuryAddress(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Invalid treasury address");
        treasuryAddress = _newTreasury;
    }

    function pauseContract() external onlyOwner {
        _pause();
    }

    function unpauseContract() external onlyOwner {
        _unpause();
    }

    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {
        // Allow contract to receive ETH
    }
}
