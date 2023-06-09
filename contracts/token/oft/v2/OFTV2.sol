// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./fee/BaseOFTWithFee.sol";

contract OFTV2 is BaseOFTWithFee, ERC20 {
    event EmergencyStopMintingCollateral(address _asset, bool state);

    mapping(address => bool) public emergencyStopMintingCollateral;

    uint internal immutable ld2sdRate;
    address public borrowerOperationsAddress;
    address public stabilityPoolAddress;
    address public vesselManagerAddress;

    // stores SC addresses that are allowed to mint/burn the token (FeeCollector, AMO strategies)
    mapping(address => bool) public whitelistedContracts;

    constructor(string memory _name, string memory _symbol, uint8 _sharedDecimals, address _lzEndpoint) ERC20(_name, _symbol) BaseOFTWithFee(_sharedDecimals, _lzEndpoint) {
        uint8 decimals = decimals();
        require(_sharedDecimals <= decimals, "OFT: sharedDecimals must be <= decimals");
        ld2sdRate = 10 ** (decimals - _sharedDecimals);
    }

    function _requireCallerIsBorrowerOperations() internal view {
        require(msg.sender == borrowerOperationsAddress, "DebtToken: Caller is not BorrowerOperations");
    }

    function _requireCallerIsBOorVesselMorSP() internal view {
        require(msg.sender == borrowerOperationsAddress || msg.sender == vesselManagerAddress || msg.sender == stabilityPoolAddress, "DebtToken: Caller is neither BorrowerOperations nor VesselManager nor StabilityPool");
    }

    function _requireCallerIsWhitelistedContract() internal view {
        require(whitelistedContracts[msg.sender], "DebtToken: Caller is not a whitelisted SC");
    }

    /************************************************************************
     * public functions
     ************************************************************************/
    function emergencyStopMinting(address _asset, bool status) external onlyOwner {
        emergencyStopMintingCollateral[_asset] = status;
        emit EmergencyStopMintingCollateral(_asset, status);
    }

    function circulatingSupply() public view virtual override returns (uint) {
        return totalSupply();
    }

    function token() public view virtual override returns (address) {
        return address(this);
    }

    function mint(address _asset, address _account, uint256 _amount) external {
        _requireCallerIsBorrowerOperations();
        require(!emergencyStopMintingCollateral[_asset], "Mint is blocked on this collateral");

        _mint(_account, _amount);
    }

    function burn(address _account, uint256 _amount) external {
        _requireCallerIsBOorVesselMorSP();
        _burn(_account, _amount);
    }

    function mintFromWhitelistedContract(uint256 _amount) external {
        _requireCallerIsWhitelistedContract();
        _mint(msg.sender, _amount);
    }

    function burnFromWhitelistedContract(uint256 _amount) external {
        _requireCallerIsWhitelistedContract();
        _burn(msg.sender, _amount);
    }

    function sendToPool(address _sender, address _poolAddress, uint256 _amount) external {
        _requireCallerIsStabilityPool();
        _transfer(_sender, _poolAddress, _amount);
    }

    function returnFromPool(address _poolAddress, address _receiver, uint256 _amount) external {
        _requireCallerIsVesselMorSP();
        _transfer(_poolAddress, _receiver, _amount);
    }

    function setAddresses(address _borrowerOperationsAddress, address _stabilityPoolAddress, address _vesselManagerAddress) public onlyOwner {
        borrowerOperationsAddress = _borrowerOperationsAddress;
        stabilityPoolAddress = _stabilityPoolAddress;
        vesselManagerAddress = _vesselManagerAddress;
    }

    /************************************************************************
     * internal functions
     ************************************************************************/
    function _debitFrom(address _from, uint16, bytes32, uint _amount) internal virtual override returns (uint) {
        address spender = _msgSender();
        if (_from != spender) _spendAllowance(_from, spender, _amount);
        _burn(_from, _amount);
        return _amount;
    }

    function _creditTo(uint16, address _toAddress, uint _amount) internal virtual override returns (uint) {
        _mint(_toAddress, _amount);
        return _amount;
    }

    function _transferFrom(address _from, address _to, uint _amount) internal virtual override returns (uint) {
        address spender = _msgSender();
        // if transfer from this contract, no need to check allowance
        if (_from != address(this) && _from != spender) _spendAllowance(_from, spender, _amount);
        _transfer(_from, _to, _amount);
        return _amount;
    }

    function _ld2sdRate() internal view virtual override returns (uint) {
        return ld2sdRate;
    }

    function _requireCallerIsStabilityPool() internal view {
        require(msg.sender == stabilityPoolAddress, "DebtToken: Caller is not the StabilityPool");
    }

    function _requireCallerIsVesselMorSP() internal view {
        require(msg.sender == vesselManagerAddress || msg.sender == stabilityPoolAddress, "DebtToken: Caller is neither VesselManager nor StabilityPool");
    }
}
