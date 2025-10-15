// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./XStreamCore.sol";
import "./XStreamNFT.sol";
import "./XStreamAds.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title XStreamFactory
 * @dev Factory contract to deploy and manage all xStream contracts
 */
contract XStreamFactory is Ownable {
    address public xstreamCore;
    address public xstreamNFT;
    address public xstreamAds;
    address public treasury;
    uint256 public deployedAt;

    event ContractsDeployed(
        address indexed xstreamCore,
        address indexed xstreamNFT,
        address indexed xstreamAds,
        address treasury
    );

    constructor() {
        // Treasury initially set to deployer
        treasury = msg.sender;
        _deployContracts();
    }

    function _deployContracts() internal {
        // Deploy XStreamCore first
        XStreamCore coreContract = new XStreamCore(treasury);
        xstreamCore = address(coreContract);

        // Deploy XStreamNFT with reference to XStreamCore
        XStreamNFT nftContract = new XStreamNFT(xstreamCore);
        xstreamNFT = address(nftContract);

        // Deploy XStreamAds with references to treasury and XStreamCore
        XStreamAds adsContract = new XStreamAds(treasury, xstreamCore);
        xstreamAds = address(adsContract);

        deployedAt = block.timestamp;

        // Transfer ownership of all contracts to the deployer
        coreContract.transferOwnership(msg.sender);
        nftContract.transferOwnership(msg.sender);
        adsContract.transferOwnership(msg.sender);

        emit ContractsDeployed(xstreamCore, xstreamNFT, xstreamAds, treasury);
    }

    function getContractAddresses()
        external
        view
        returns (
            address _xstreamCore,
            address _xstreamNFT,
            address _xstreamAds,
            address _treasury
        )
    {
        return (xstreamCore, xstreamNFT, xstreamAds, treasury);
    }

    function getDeploymentInfo()
        external
        view
        returns (
            address _xstreamCore,
            address _xstreamNFT,
            address _xstreamAds,
            address _treasury,
            uint256 _deployedAt
        )
    {
        return (xstreamCore, xstreamNFT, xstreamAds, treasury, deployedAt);
    }
}
