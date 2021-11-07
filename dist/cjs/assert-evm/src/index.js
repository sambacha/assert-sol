"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chaiEthers = void 0;
require("./types");
const bigNumber_1 = require("./matchers/bigNumber");
const reverted_1 = require("./matchers/reverted");
const revertedWith_1 = require("./matchers/revertedWith");
const emit_1 = require("./matchers/emit");
const properAddress_1 = require("./matchers/properAddress");
const properPrivateKey_1 = require("./matchers/properPrivateKey");
const properHex_1 = require("./matchers/properHex");
const changeTokenBalance_1 = require("./matchers/changeTokenBalance");
const changeTokenBalances_1 = require("./matchers/changeTokenBalances");
function chaiEthers(chai, utils) {
    (0, bigNumber_1.supportBigNumber)(chai.Assertion, utils);
    (0, reverted_1.supportReverted)(chai.Assertion);
    (0, revertedWith_1.supportRevertedWith)(chai.Assertion);
    (0, emit_1.supportEmit)(chai.Assertion);
    (0, properAddress_1.supportProperAddress)(chai.Assertion);
    (0, properPrivateKey_1.supportProperPrivateKey)(chai.Assertion);
    (0, properHex_1.supportProperHex)(chai.Assertion);
    (0, changeTokenBalance_1.supportChangeTokenBalance)(chai.Assertion);
    (0, changeTokenBalances_1.supportChangeTokenBalances)(chai.Assertion);
}
exports.chaiEthers = chaiEthers;
