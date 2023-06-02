// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../token/oft/v2/ProxyOFTV2.sol";

/// @title A LayerZero OmnichainFungibleToken example of BasedOFT
/// @notice Use this contract only on the BASE CHAIN. It locks tokens on source, on outgoing send(), and unlocks tokens when receiving from other chains.
contract ExampleProxyOFTV2 is ProxyOFTV2 {
    constructor(address _token, uint8 _sharedDecimals, address _layerZeroEndpoint) ProxyOFTV2(_token, _sharedDecimals, _layerZeroEndpoint) {}
}
