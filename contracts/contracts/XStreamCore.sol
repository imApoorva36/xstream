// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title XStreamCore
 * @dev Minimal contract for xStream pay-per-second video monetization
 * @notice Most data is stored off-chain in the database for better performance
 */
contract XStreamCore is ReentrancyGuard, Ownable, Pausable {
    // Structs
    struct ViewSession {
        address viewer;
        uint256 stakedAmount;
        uint256 startTime;
        bool isActive;
    }

    // State variables
    mapping(bytes32 => ViewSession) public viewSessions;
    mapping(address => uint256) public stakedBalances;
    mapping(address => uint256) public creatorEarnings;

    uint256 public platformFeePercentage = 5; // 5% platform fee
    uint256 public constant PERCENTAGE_BASE = 100;

    address public treasuryAddress;
    address public nftContract;

    // Events
    event StakeDeposited(address indexed user, uint256 amount);
    event ViewSessionStarted(
        bytes32 indexed sessionId,
        address indexed viewer,
        uint256 stakedAmount
    );
    event ViewSessionEnded(
        bytes32 indexed sessionId,
        uint256 payment,
        address indexed creator
    );
    event StakeWithdrawn(address indexed user, uint256 amount);
    event CreatorEarningsWithdrawn(address indexed creator, uint256 amount);

    constructor(address _treasuryAddress) {
        treasuryAddress = _treasuryAddress;
    }

    // Set NFT contract address (called by factory)
    function setNFTContract(address _nftContract) external onlyOwner {
        nftContract = _nftContract;
    }

    /**
     * @dev Deposit stake for viewing videos
     */
    function depositStake() external payable whenNotPaused {
        require(msg.value > 0, "Must deposit positive amount");
        stakedBalances[msg.sender] += msg.value;
        emit StakeDeposited(msg.sender, msg.value);
    }

    /**
     * @dev Start a viewing session with staked amount
     * @param _sessionId Unique session ID from backend
     * @param _maxStakeAmount Maximum amount to stake for this session
     */
    function startViewSession(
        bytes32 _sessionId,
        uint256 _maxStakeAmount
    ) external whenNotPaused {
        require(
            stakedBalances[msg.sender] >= _maxStakeAmount,
            "Insufficient stake"
        );
        require(!viewSessions[_sessionId].isActive, "Session already active");

        viewSessions[_sessionId] = ViewSession({
            viewer: msg.sender,
            stakedAmount: _maxStakeAmount,
            startTime: block.timestamp,
            isActive: true
        });

        emit ViewSessionStarted(_sessionId, msg.sender, _maxStakeAmount);
    }

    /**
     * @dev End viewing session and process payment
     * @param _sessionId Session ID to end
     * @param _payment Final payment amount calculated by backend
     * @param _creator Video creator address
     */
    function endViewSession(
        bytes32 _sessionId,
        uint256 _payment,
        address _creator
    ) external whenNotPaused nonReentrant {
        ViewSession storage session = viewSessions[_sessionId];
        require(session.isActive, "Session not active");
        require(session.viewer == msg.sender, "Not session owner");
        require(stakedBalances[msg.sender] >= _payment, "Insufficient stake");

        // Update session
        session.isActive = false;

        // Deduct payment from stake
        stakedBalances[msg.sender] -= _payment;

        // Calculate platform fee and creator earnings
        uint256 platformFee = (_payment * platformFeePercentage) /
            PERCENTAGE_BASE;
        uint256 creatorPayment = _payment - platformFee;

        // Update creator earnings
        creatorEarnings[_creator] += creatorPayment;

        // Transfer platform fee to treasury
        if (platformFee > 0) {
            payable(treasuryAddress).transfer(platformFee);
        }

        // Trigger NFT achievement check if contract is set
        if (nftContract != address(0)) {
            (bool success, ) = nftContract.call(
                abi.encodeWithSignature(
                    "checkAndMintAchievements(address,uint8,uint256)",
                    msg.sender,
                    0, // WATCH_TIME type
                    _payment
                )
            );
            // Ignore if NFT call fails
            success;
        }

        emit ViewSessionEnded(_sessionId, _payment, _creator);
    }

    /**
     * @dev Withdraw available stake
     * @param _amount Amount to withdraw
     */
    function withdrawStake(uint256 _amount) external nonReentrant {
        require(stakedBalances[msg.sender] >= _amount, "Insufficient balance");

        stakedBalances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);

        emit StakeWithdrawn(msg.sender, _amount);
    }

    /**
     * @dev Withdraw creator earnings
     */
    function withdrawCreatorEarnings() external nonReentrant {
        uint256 earnings = creatorEarnings[msg.sender];
        require(earnings > 0, "No earnings to withdraw");

        creatorEarnings[msg.sender] = 0;
        payable(msg.sender).transfer(earnings);

        emit CreatorEarningsWithdrawn(msg.sender, earnings);
    }

    // View Functions
    function getStakedBalance(address _user) external view returns (uint256) {
        return stakedBalances[_user];
    }

    function getCreatorEarnings(
        address _creator
    ) external view returns (uint256) {
        return creatorEarnings[_creator];
    }

    function getViewSession(
        bytes32 _sessionId
    ) external view returns (ViewSession memory) {
        return viewSessions[_sessionId];
    }

    // Admin Functions
    function setPlatformFee(uint256 _newFeePercentage) external onlyOwner {
        require(_newFeePercentage <= 10, "Fee cannot exceed 10%");
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
