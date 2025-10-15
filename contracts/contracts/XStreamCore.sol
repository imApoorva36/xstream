// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title XStreamCore
 * @dev Main contract for xStream pay-per-second video monetization
 */
contract XStreamCore is ReentrancyGuard, Ownable, Pausable {
    using SafeMath for uint256;

    // Structs
    struct Video {
        uint256 id;
        address creator;
        string metadataURI; // IPFS hash for video metadata
        uint256 pricePerSecond; // Price in wei per second
        uint256 duration; // Video duration in seconds
        bool isActive;
        uint256 totalEarnings;
        uint256 totalViewTime;
        uint256 createdAt;
    }

    struct ViewSession {
        uint256 videoId;
        address viewer;
        uint256 startTime;
        uint256 endTime;
        uint256 amountPaid;
        bool isActive;
        uint256 stakedAmount;
    }

    struct Creator {
        address creatorAddress;
        uint256 totalEarnings;
        uint256 totalVideos;
        uint256 totalViewTime;
        bool isVerified;
        string profileURI; // IPFS hash for creator profile
    }

    // State variables
    mapping(uint256 => Video) public videos;
    mapping(address => Creator) public creators;
    mapping(bytes32 => ViewSession) public viewSessions;
    mapping(address => uint256) public stakedBalances;
    mapping(address => uint256[]) public creatorVideos;
    mapping(address => bytes32[]) public viewerSessions;

    uint256 public videoCounter;
    uint256 public platformFeePercentage = 5; // 5% platform fee
    uint256 public constant PERCENTAGE_BASE = 100;

    address public treasuryAddress;
    address public nftContract;

    // Events
    event VideoUploaded(
        uint256 indexed videoId,
        address indexed creator,
        uint256 pricePerSecond
    );
    event ViewSessionStarted(
        bytes32 indexed sessionId,
        uint256 indexed videoId,
        address indexed viewer
    );
    event ViewSessionEnded(
        bytes32 indexed sessionId,
        uint256 watchTime,
        uint256 payment
    );
    event StakeDeposited(address indexed user, uint256 amount);
    event StakeWithdrawn(address indexed user, uint256 amount);
    event CreatorEarningsWithdrawn(address indexed creator, uint256 amount);
    event PlatformFeeUpdated(uint256 newFeePercentage);

    constructor(address _treasuryAddress) {
        treasuryAddress = _treasuryAddress;
    }

    // Set NFT contract address (called by factory)
    function setNFTContract(address _nftContract) external onlyOwner {
        nftContract = _nftContract;
    }

    // Modifiers
    modifier onlyActiveVideo(uint256 _videoId) {
        require(videos[_videoId].isActive, "Video not active");
        _;
    }

    modifier onlyCreator(uint256 _videoId) {
        require(videos[_videoId].creator == msg.sender, "Not video creator");
        _;
    }

    // Internal helper function for NFT achievements
    function _triggerNFTAchievement(
        address _user,
        uint256 _type,
        uint256 _value
    ) internal {
        if (nftContract != address(0)) {
            // Use low-level call to avoid reverting the main transaction if NFT fails
            (bool success, ) = nftContract.call(
                abi.encodeWithSignature(
                    "checkAndMintAchievements(address,uint8,uint256)",
                    _user,
                    _type,
                    _value
                )
            );
            // Intentionally ignore success to not revert main transaction
            success; // Suppress unused variable warning
        }
    }

    // Creator Functions
    function uploadVideo(
        string memory _metadataURI,
        uint256 _pricePerSecond,
        uint256 _duration
    ) external whenNotPaused returns (uint256) {
        require(_pricePerSecond > 0, "Price must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");

        videoCounter++;

        videos[videoCounter] = Video({
            id: videoCounter,
            creator: msg.sender,
            metadataURI: _metadataURI,
            pricePerSecond: _pricePerSecond,
            duration: _duration,
            isActive: true,
            totalEarnings: 0,
            totalViewTime: 0,
            createdAt: block.timestamp
        });

        // Update creator stats
        if (creators[msg.sender].creatorAddress == address(0)) {
            creators[msg.sender] = Creator({
                creatorAddress: msg.sender,
                totalEarnings: 0,
                totalVideos: 1,
                totalViewTime: 0,
                isVerified: false,
                profileURI: ""
            });
        } else {
            creators[msg.sender].totalVideos++;
        }

        creatorVideos[msg.sender].push(videoCounter);

        emit VideoUploaded(videoCounter, msg.sender, _pricePerSecond);

        // Trigger NFT achievement check for creator uploads
        _triggerNFTAchievement(msg.sender, 1, creators[msg.sender].totalVideos); // CREATOR_UPLOAD type

        return videoCounter;
    }

    // Viewer Functions
    function depositStake() external payable whenNotPaused {
        require(msg.value > 0, "Must deposit positive amount");
        stakedBalances[msg.sender] = stakedBalances[msg.sender].add(msg.value);
        emit StakeDeposited(msg.sender, msg.value);
    }

    function startViewSession(
        uint256 _videoId
    ) external whenNotPaused onlyActiveVideo(_videoId) returns (bytes32) {
        require(stakedBalances[msg.sender] > 0, "Must have staked balance");

        bytes32 sessionId = keccak256(
            abi.encodePacked(msg.sender, _videoId, block.timestamp)
        );

        // Check if user has any active sessions
        require(!_hasActiveSession(msg.sender), "Already has active session");

        uint256 maxPossibleCost = videos[_videoId].pricePerSecond.mul(
            videos[_videoId].duration
        );
        require(
            stakedBalances[msg.sender] >= maxPossibleCost,
            "Insufficient stake for full video"
        );

        viewSessions[sessionId] = ViewSession({
            videoId: _videoId,
            viewer: msg.sender,
            startTime: block.timestamp,
            endTime: 0,
            amountPaid: 0,
            isActive: true,
            stakedAmount: maxPossibleCost
        });

        viewerSessions[msg.sender].push(sessionId);

        emit ViewSessionStarted(sessionId, _videoId, msg.sender);
        return sessionId;
    }

    function endViewSession(
        bytes32 _sessionId,
        uint256 _watchedSeconds
    ) external whenNotPaused nonReentrant {
        ViewSession storage session = viewSessions[_sessionId];
        require(session.isActive, "Session not active");
        require(session.viewer == msg.sender, "Not session owner");

        Video storage video = videos[session.videoId];

        // Calculate payment based on watched time
        uint256 payment = video.pricePerSecond.mul(_watchedSeconds);
        require(stakedBalances[msg.sender] >= payment, "Insufficient stake");

        // Update session
        session.endTime = block.timestamp;
        session.amountPaid = payment;
        session.isActive = false;

        // Deduct payment from stake
        stakedBalances[msg.sender] = stakedBalances[msg.sender].sub(payment);

        // Calculate platform fee and creator earnings
        uint256 platformFee = payment.mul(platformFeePercentage).div(
            PERCENTAGE_BASE
        );
        uint256 creatorEarnings = payment.sub(platformFee);

        // Update video and creator stats
        video.totalEarnings = video.totalEarnings.add(creatorEarnings);
        video.totalViewTime = video.totalViewTime.add(_watchedSeconds);

        creators[video.creator].totalEarnings = creators[video.creator]
            .totalEarnings
            .add(creatorEarnings);
        creators[video.creator].totalViewTime = creators[video.creator]
            .totalViewTime
            .add(_watchedSeconds);

        // Transfer platform fee to treasury
        payable(treasuryAddress).transfer(platformFee);

        emit ViewSessionEnded(_sessionId, _watchedSeconds, payment);
    }

    function withdrawStake(uint256 _amount) external nonReentrant {
        require(stakedBalances[msg.sender] >= _amount, "Insufficient balance");
        require(
            !_hasActiveSession(msg.sender),
            "Cannot withdraw with active session"
        );

        stakedBalances[msg.sender] = stakedBalances[msg.sender].sub(_amount);
        payable(msg.sender).transfer(_amount);

        emit StakeWithdrawn(msg.sender, _amount);
    }

    function withdrawCreatorEarnings() external nonReentrant {
        uint256 earnings = creators[msg.sender].totalEarnings;
        require(earnings > 0, "No earnings to withdraw");

        creators[msg.sender].totalEarnings = 0;
        payable(msg.sender).transfer(earnings);

        emit CreatorEarningsWithdrawn(msg.sender, earnings);
    }

    // View Functions
    function getVideo(uint256 _videoId) external view returns (Video memory) {
        return videos[_videoId];
    }

    function getCreator(
        address _creator
    ) external view returns (Creator memory) {
        return creators[_creator];
    }

    function getCreatorVideos(
        address _creator
    ) external view returns (uint256[] memory) {
        return creatorVideos[_creator];
    }

    function getViewerSessions(
        address _viewer
    ) external view returns (bytes32[] memory) {
        return viewerSessions[_viewer];
    }

    function getStakedBalance(address _user) external view returns (uint256) {
        return stakedBalances[_user];
    }

    // Internal Functions
    function _hasActiveSession(address _viewer) internal view returns (bool) {
        bytes32[] memory sessions = viewerSessions[_viewer];
        for (uint i = 0; i < sessions.length; i++) {
            if (viewSessions[sessions[i]].isActive) {
                return true;
            }
        }
        return false;
    }

    // Admin Functions
    function setPlatformFee(uint256 _newFeePercentage) external onlyOwner {
        require(_newFeePercentage <= 10, "Fee cannot exceed 10%");
        platformFeePercentage = _newFeePercentage;
        emit PlatformFeeUpdated(_newFeePercentage);
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

    function deactivateVideo(uint256 _videoId) external onlyCreator(_videoId) {
        videos[_videoId].isActive = false;
    }

    function reactivateVideo(uint256 _videoId) external onlyCreator(_videoId) {
        videos[_videoId].isActive = true;
    }

    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {
        // Allow contract to receive ETH
    }
}
