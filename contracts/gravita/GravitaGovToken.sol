// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../token/oft/v2/OFTV2.sol";

contract GravitaGovToken is OFTV2 {
    constructor(address _layerZeroEndpoint) OFTV2("Gravita Gov Token", "GRAV", _layerZeroEndpoint) {}
}
