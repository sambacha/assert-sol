"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportChangeTokenBalance = void 0;
const ethers_1 = require("ethers");
const account_1 = require("./misc/account");
function supportChangeTokenBalance(Assertion) {
    Assertion.addMethod('changeTokenBalance', function (token, signer, balanceChange) {
        const subject = this._obj;
        const derivedPromise = Promise.all([
            getBalanceChangeForTransactionCall(subject, token, signer),
            (0, account_1.getAddressOf)(signer)
        ]).then(([actualChange, address]) => {
            this.assert(actualChange.eq(ethers_1.BigNumber.from(balanceChange)), `Expected "${address}" to change balance by ${balanceChange} wei, ` +
                `but it has changed by ${actualChange} wei`, `Expected "${address}" to not change balance by ${balanceChange} wei,`, balanceChange, actualChange);
        });
        this.then = derivedPromise.then.bind(derivedPromise);
        this.catch = derivedPromise.catch.bind(derivedPromise);
        this.promise = derivedPromise;
        return this;
    });
}
exports.supportChangeTokenBalance = supportChangeTokenBalance;
async function getBalanceChangeForTransactionCall(transactionCall, token, account) {
    const balanceBefore = await token.balanceOf(await (0, account_1.getAddressOf)(account));
    await transactionCall();
    const balanceAfter = await token.balanceOf(await (0, account_1.getAddressOf)(account));
    return balanceAfter.sub(balanceBefore);
}
