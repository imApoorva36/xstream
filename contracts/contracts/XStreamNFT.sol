// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract XStreamNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    enum AchievementType {
        WATCH_TIME,
        SPENDING,
        CREATOR_UPLOAD,
        CREATOR_EARNINGS,
        PLATFORM_LOYALTY
    }

    mapping(address => mapping(uint256 => bool)) public hasAchievement;
    mapping(uint256 => address) public tokenOwners;

    address public xstreamCore;

    event NFTMinted(
        address indexed user,
        uint256 indexed tokenId,
        uint256 indexed achievementId,
        string tokenURI
    );
    event AchievementChecked(
        address indexed user,
        AchievementType achievementType,
        uint256 value
    );

    modifier onlyXStreamCore() {
        require(
            msg.sender == xstreamCore || msg.sender == owner(),
            "Not authorized"
        );
        _;
    }

    constructor(
        address _xstreamCore
    ) ERC721("XStream Achievement NFT", "XNFT") {
        xstreamCore = _xstreamCore;
    }

    function setXStreamCore(address _xstreamCore) external onlyOwner {
        xstreamCore = _xstreamCore;
    }

    function mintAchievement(
        address _user,
        uint256 _achievementId,
        string memory _tokenURI
    ) external onlyXStreamCore returns (uint256) {
        require(
            !hasAchievement[_user][_achievementId],
            "Achievement already minted"
        );

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(_user, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        hasAchievement[_user][_achievementId] = true;
        tokenOwners[tokenId] = _user;

        emit NFTMinted(_user, tokenId, _achievementId, _tokenURI);
        return tokenId;
    }

    function checkAndMintAchievements(
        address _user,
        uint8 _type,
        uint256 _value
    ) external onlyXStreamCore {
        emit AchievementChecked(_user, AchievementType(_type), _value);
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function userHasAchievement(
        address _user,
        uint256 _achievementId
    ) external view returns (bool) {
        return hasAchievement[_user][_achievementId];
    }

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
    ) public view override(ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
