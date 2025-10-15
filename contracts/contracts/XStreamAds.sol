// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title XStreamAds
 * @dev Advertisement contract for xStream platform
 */
contract XStreamAds is ReentrancyGuard, Ownable, Pausable {
    using SafeMath for uint256;

    struct AdCampaign {
        uint256 id;
        address advertiser;
        string name;
        string description;
        string adContentURI; // IPFS hash for ad content
        uint256 budgetTotal;
        uint256 budgetRemaining;
        uint256 pricePerView;
        uint256 pricePerSkip;
        uint256 totalViews;
        uint256 totalSkips;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        string[] targetCategories;
        uint256 minAge;
        uint256 maxAge;
    }

    struct AdView {
        uint256 campaignId;
        address viewer;
        uint256 timestamp;
        bool wasSkipped;
        uint256 watchTime; // seconds watched before skip
        uint256 payment;
    }

    // State variables
    mapping(uint256 => AdCampaign) public campaigns;
    mapping(address => uint256[]) public advertiserCampaigns;
    mapping(uint256 => AdView[]) public campaignViews;
    mapping(address => uint256) public advertiserBalances;

    uint256 public campaignCounter;
    uint256 public platformFeePercentage = 10; // 10% platform fee for ads
    uint256 public constant PERCENTAGE_BASE = 100;

    address public treasuryAddress;
    address public xstreamCore;

    // Events
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed advertiser,
        uint256 budget
    );
    event AdViewed(
        uint256 indexed campaignId,
        address indexed viewer,
        bool wasSkipped,
        uint256 payment
    );
    event BudgetAdded(uint256 indexed campaignId, uint256 amount);
    event CampaignPaused(uint256 indexed campaignId);
    event CampaignResumed(uint256 indexed campaignId);
    event RefundIssued(
        uint256 indexed campaignId,
        address indexed advertiser,
        uint256 amount
    );

    modifier onlyXStreamCore() {
        require(msg.sender == xstreamCore, "Only XStreamCore can call");
        _;
    }

    modifier onlyAdvertiser(uint256 _campaignId) {
        require(
            campaigns[_campaignId].advertiser == msg.sender,
            "Not campaign owner"
        );
        _;
    }

    constructor(address _treasuryAddress, address _xstreamCore) {
        treasuryAddress = _treasuryAddress;
        xstreamCore = _xstreamCore;
    }

    function createCampaign(
        string memory _name,
        string memory _description,
        string memory _adContentURI,
        uint256 _pricePerView,
        uint256 _pricePerSkip,
        uint256 _duration, // Campaign duration in seconds
        string[] memory _targetCategories,
        uint256 _minAge,
        uint256 _maxAge
    ) external payable whenNotPaused returns (uint256) {
        require(msg.value > 0, "Must provide initial budget");
        require(_pricePerView > 0, "Price per view must be positive");
        require(_pricePerSkip > 0, "Price per skip must be positive");
        require(_duration > 0, "Duration must be positive");

        campaignCounter++;

        campaigns[campaignCounter] = AdCampaign({
            id: campaignCounter,
            advertiser: msg.sender,
            name: _name,
            description: _description,
            adContentURI: _adContentURI,
            budgetTotal: msg.value,
            budgetRemaining: msg.value,
            pricePerView: _pricePerView,
            pricePerSkip: _pricePerSkip,
            totalViews: 0,
            totalSkips: 0,
            startTime: block.timestamp,
            endTime: block.timestamp.add(_duration),
            isActive: true,
            targetCategories: _targetCategories,
            minAge: _minAge,
            maxAge: _maxAge
        });

        advertiserCampaigns[msg.sender].push(campaignCounter);
        advertiserBalances[msg.sender] = advertiserBalances[msg.sender].add(
            msg.value
        );

        emit CampaignCreated(campaignCounter, msg.sender, msg.value);
        return campaignCounter;
    }

    function addBudget(
        uint256 _campaignId
    ) external payable onlyAdvertiser(_campaignId) whenNotPaused {
        require(msg.value > 0, "Must add positive amount");
        require(campaigns[_campaignId].isActive, "Campaign not active");

        campaigns[_campaignId].budgetTotal = campaigns[_campaignId]
            .budgetTotal
            .add(msg.value);
        campaigns[_campaignId].budgetRemaining = campaigns[_campaignId]
            .budgetRemaining
            .add(msg.value);
        advertiserBalances[msg.sender] = advertiserBalances[msg.sender].add(
            msg.value
        );

        emit BudgetAdded(_campaignId, msg.value);
    }

    function recordAdView(
        uint256 _campaignId,
        address _viewer,
        bool _wasSkipped,
        uint256 _watchTime
    ) external onlyXStreamCore nonReentrant {
        AdCampaign storage campaign = campaigns[_campaignId];
        require(campaign.isActive, "Campaign not active");
        require(block.timestamp <= campaign.endTime, "Campaign expired");
        require(campaign.budgetRemaining > 0, "Campaign out of budget");

        uint256 payment = _wasSkipped
            ? campaign.pricePerSkip
            : campaign.pricePerView;
        require(
            campaign.budgetRemaining >= payment,
            "Insufficient budget for payment"
        );

        // Record the view
        campaignViews[_campaignId].push(
            AdView({
                campaignId: _campaignId,
                viewer: _viewer,
                timestamp: block.timestamp,
                wasSkipped: _wasSkipped,
                watchTime: _watchTime,
                payment: payment
            })
        );

        // Update campaign stats
        if (_wasSkipped) {
            campaign.totalSkips++;
        } else {
            campaign.totalViews++;
        }

        campaign.budgetRemaining = campaign.budgetRemaining.sub(payment);

        // Calculate platform fee
        uint256 platformFee = payment.mul(platformFeePercentage).div(
            PERCENTAGE_BASE
        );
        uint256 viewerReward = payment.sub(platformFee);

        // Transfer payments
        payable(treasuryAddress).transfer(platformFee);
        payable(_viewer).transfer(viewerReward);

        // Deactivate campaign if budget exhausted
        if (campaign.budgetRemaining == 0) {
            campaign.isActive = false;
        }

        emit AdViewed(_campaignId, _viewer, _wasSkipped, payment);
    }

    function pauseCampaign(
        uint256 _campaignId
    ) external onlyAdvertiser(_campaignId) {
        campaigns[_campaignId].isActive = false;
        emit CampaignPaused(_campaignId);
    }

    function resumeCampaign(
        uint256 _campaignId
    ) external onlyAdvertiser(_campaignId) {
        require(
            block.timestamp <= campaigns[_campaignId].endTime,
            "Campaign expired"
        );
        require(
            campaigns[_campaignId].budgetRemaining > 0,
            "No budget remaining"
        );

        campaigns[_campaignId].isActive = true;
        emit CampaignResumed(_campaignId);
    }

    function withdrawRemainingBudget(
        uint256 _campaignId
    ) external onlyAdvertiser(_campaignId) nonReentrant {
        AdCampaign storage campaign = campaigns[_campaignId];
        require(
            !campaign.isActive || block.timestamp > campaign.endTime,
            "Campaign still active"
        );
        require(campaign.budgetRemaining > 0, "No budget to withdraw");

        uint256 refundAmount = campaign.budgetRemaining;
        campaign.budgetRemaining = 0;
        advertiserBalances[msg.sender] = advertiserBalances[msg.sender].sub(
            refundAmount
        );

        payable(msg.sender).transfer(refundAmount);
        emit RefundIssued(_campaignId, msg.sender, refundAmount);
    }

    // View functions
    function getCampaign(
        uint256 _campaignId
    ) external view returns (AdCampaign memory) {
        return campaigns[_campaignId];
    }

    function getAdvertiserCampaigns(
        address _advertiser
    ) external view returns (uint256[] memory) {
        return advertiserCampaigns[_advertiser];
    }

    function getCampaignViews(
        uint256 _campaignId
    ) external view returns (AdView[] memory) {
        return campaignViews[_campaignId];
    }

    function getCampaignStats(
        uint256 _campaignId
    )
        external
        view
        returns (
            uint256 totalViews,
            uint256 totalSkips,
            uint256 budgetSpent,
            uint256 budgetRemaining,
            bool isActive
        )
    {
        AdCampaign memory campaign = campaigns[_campaignId];
        return (
            campaign.totalViews,
            campaign.totalSkips,
            campaign.budgetTotal.sub(campaign.budgetRemaining),
            campaign.budgetRemaining,
            campaign.isActive && block.timestamp <= campaign.endTime
        );
    }

    function getActiveCampaigns() external view returns (uint256[] memory) {
        uint256[] memory activeCampaigns = new uint256[](campaignCounter);
        uint256 activeCount = 0;

        for (uint256 i = 1; i <= campaignCounter; i++) {
            if (
                campaigns[i].isActive &&
                block.timestamp <= campaigns[i].endTime &&
                campaigns[i].budgetRemaining > 0
            ) {
                activeCampaigns[activeCount] = i;
                activeCount++;
            }
        }

        // Resize array to actual count
        uint256[] memory result = new uint256[](activeCount);
        for (uint256 i = 0; i < activeCount; i++) {
            result[i] = activeCampaigns[i];
        }

        return result;
    }

    // Admin functions
    function setPlatformFee(uint256 _newFeePercentage) external onlyOwner {
        require(_newFeePercentage <= 20, "Fee cannot exceed 20%");
        platformFeePercentage = _newFeePercentage;
    }

    function setTreasuryAddress(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Invalid treasury address");
        treasuryAddress = _newTreasury;
    }

    function setXStreamCore(address _newCore) external onlyOwner {
        xstreamCore = _newCore;
    }

    function pauseContract() external onlyOwner {
        _pause();
    }

    function unpauseContract() external onlyOwner {
        _unpause();
    }

    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {
        // Allow contract to receive ETH
    }
}
