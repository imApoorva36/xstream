// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title XStreamNFT
 * @dev NFT contract for xStream achievement system
 */
contract XStreamNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Achievement types
    enum AchievementType {
        WATCH_TIME, // Watching milestone (10min, 50min, 100min+)
        SPENDING, // Spending milestone ($10, $50, $100+)
        CREATOR_UPLOAD, // Creator upload milestones
        CREATOR_EARNINGS, // Creator earnings milestones
        PLATFORM_LOYALTY // Long-term platform usage
    }

    struct Achievement {
        AchievementType achievementType;
        uint256 threshold;
        string name;
        string description;
        string imageURI;
        uint256 utilityLevel; // 1-5, higher = more utility
        bool isActive;
    }

    struct UserAchievement {
        uint256 tokenId;
        address user;
        uint256 achievementId;
        uint256 earnedAt;
        uint256 currentValue; // Current progress value
    }

    // State variables
    mapping(uint256 => Achievement) public achievements;
    mapping(address => uint256[]) public userAchievements;
    mapping(address => mapping(uint256 => bool)) public hasAchievement;
    mapping(uint256 => UserAchievement) public tokenAchievements;

    address public xstreamCore;
    uint256 public achievementCounter;

    // Events
    event AchievementCreated(
        uint256 indexed achievementId,
        AchievementType achievementType,
        uint256 threshold
    );
    event NFTMinted(
        address indexed user,
        uint256 indexed tokenId,
        uint256 indexed achievementId
    );
    event UtilityUsed(
        address indexed user,
        uint256 indexed tokenId,
        string utility
    );

    modifier onlyXStreamCore() {
        require(msg.sender == xstreamCore, "Only XStreamCore can call");
        _;
    }

    constructor(
        address _xstreamCore
    ) ERC721("XStream Achievement NFT", "XNFT") {
        xstreamCore = _xstreamCore;
        _initializeAchievements();
    }

    function _initializeAchievements() internal {
        // Watch time achievements (in seconds)
        _createAchievement(
            AchievementType.WATCH_TIME,
            600,
            "First 10 Minutes",
            "Watched 10 minutes of content",
            "ipfs://watch10min",
            1
        );
        _createAchievement(
            AchievementType.WATCH_TIME,
            3000,
            "50 Minute Milestone",
            "Watched 50 minutes of content",
            "ipfs://watch50min",
            2
        );
        _createAchievement(
            AchievementType.WATCH_TIME,
            6000,
            "100 Minute Champion",
            "Watched 100 minutes of content",
            "ipfs://watch100min",
            3
        );

        // Spending achievements (in wei - equivalent to $10, $50, $100)
        _createAchievement(
            AchievementType.SPENDING,
            10 ether,
            "First Supporter",
            "Spent $10 on content",
            "ipfs://spend10",
            1
        );
        _createAchievement(
            AchievementType.SPENDING,
            50 ether,
            "Content Patron",
            "Spent $50 on content",
            "ipfs://spend50",
            2
        );
        _createAchievement(
            AchievementType.SPENDING,
            100 ether,
            "Platform Champion",
            "Spent $100 on content",
            "ipfs://spend100",
            3
        );

        // Creator achievements
        _createAchievement(
            AchievementType.CREATOR_UPLOAD,
            1,
            "First Upload",
            "Uploaded first video",
            "ipfs://upload1",
            1
        );
        _createAchievement(
            AchievementType.CREATOR_UPLOAD,
            10,
            "Content Creator",
            "Uploaded 10 videos",
            "ipfs://upload10",
            2
        );
        _createAchievement(
            AchievementType.CREATOR_UPLOAD,
            50,
            "Video Producer",
            "Uploaded 50 videos",
            "ipfs://upload50",
            3
        );

        // Creator earnings achievements (in wei)
        _createAchievement(
            AchievementType.CREATOR_EARNINGS,
            1 ether,
            "First Earnings",
            "Earned first dollar",
            "ipfs://earn1",
            1
        );
        _createAchievement(
            AchievementType.CREATOR_EARNINGS,
            100 ether,
            "Successful Creator",
            "Earned $100",
            "ipfs://earn100",
            2
        );
        _createAchievement(
            AchievementType.CREATOR_EARNINGS,
            1000 ether,
            "Top Creator",
            "Earned $1000",
            "ipfs://earn1000",
            3
        );
    }

    function _createAchievement(
        AchievementType _type,
        uint256 _threshold,
        string memory _name,
        string memory _description,
        string memory _imageURI,
        uint256 _utilityLevel
    ) internal {
        achievementCounter++;
        achievements[achievementCounter] = Achievement({
            achievementType: _type,
            threshold: _threshold,
            name: _name,
            description: _description,
            imageURI: _imageURI,
            utilityLevel: _utilityLevel,
            isActive: true
        });

        emit AchievementCreated(achievementCounter, _type, _threshold);
    }

    function checkAndMintAchievements(
        address _user,
        AchievementType _type,
        uint256 _currentValue
    ) external onlyXStreamCore {
        for (uint256 i = 1; i <= achievementCounter; i++) {
            Achievement memory achievement = achievements[i];

            if (
                achievement.achievementType == _type &&
                achievement.isActive &&
                _currentValue >= achievement.threshold &&
                !hasAchievement[_user][i]
            ) {
                _mintAchievementNFT(_user, i, _currentValue);
            }
        }
    }

    function _mintAchievementNFT(
        address _user,
        uint256 _achievementId,
        uint256 _currentValue
    ) internal {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        _mint(_user, tokenId);
        _setTokenURI(tokenId, achievements[_achievementId].imageURI);

        tokenAchievements[tokenId] = UserAchievement({
            tokenId: tokenId,
            user: _user,
            achievementId: _achievementId,
            earnedAt: block.timestamp,
            currentValue: _currentValue
        });

        userAchievements[_user].push(tokenId);
        hasAchievement[_user][_achievementId] = true;

        emit NFTMinted(_user, tokenId, _achievementId);
    }

    // Utility functions for NFT holders
    function getDiscountPercentage(
        address _user
    ) external view returns (uint256) {
        uint256[] memory tokens = userAchievements[_user];
        uint256 maxDiscount = 0;

        for (uint256 i = 0; i < tokens.length; i++) {
            uint256 achievementId = tokenAchievements[tokens[i]].achievementId;
            uint256 utilityLevel = achievements[achievementId].utilityLevel;
            uint256 discount = utilityLevel * 2; // 2% per utility level

            if (discount > maxDiscount) {
                maxDiscount = discount;
            }
        }

        return maxDiscount > 10 ? 10 : maxDiscount; // Cap at 10%
    }

    function hasUtilityLevel(
        address _user,
        uint256 _minLevel
    ) external view returns (bool) {
        uint256[] memory tokens = userAchievements[_user];

        for (uint256 i = 0; i < tokens.length; i++) {
            uint256 achievementId = tokenAchievements[tokens[i]].achievementId;
            if (achievements[achievementId].utilityLevel >= _minLevel) {
                return true;
            }
        }
        return false;
    }

    // View functions
    function getUserAchievements(
        address _user
    ) external view returns (uint256[] memory) {
        return userAchievements[_user];
    }

    function getAchievement(
        uint256 _achievementId
    ) external view returns (Achievement memory) {
        return achievements[_achievementId];
    }

    function getTokenAchievement(
        uint256 _tokenId
    ) external view returns (UserAchievement memory) {
        return tokenAchievements[_tokenId];
    }

    // Admin functions
    function createAchievement(
        AchievementType _type,
        uint256 _threshold,
        string memory _name,
        string memory _description,
        string memory _imageURI,
        uint256 _utilityLevel
    ) external onlyOwner {
        _createAchievement(
            _type,
            _threshold,
            _name,
            _description,
            _imageURI,
            _utilityLevel
        );
    }

    function updateAchievement(
        uint256 _achievementId,
        bool _isActive
    ) external onlyOwner {
        achievements[_achievementId].isActive = _isActive;
    }

    function setXStreamCore(address _newCore) external onlyOwner {
        xstreamCore = _newCore;
    }

    // Override functions
    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
