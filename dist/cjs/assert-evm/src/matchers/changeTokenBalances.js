"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportChangeTokenBalances = void 0;
const ethers_1 = require("ethers");
const account_1 = require("./misc/account");
function supportChangeTokenBalances(Assertion) {
    Assertion.addMethod('changeTokenBalances', function (token, signers, balanceChanges) {
        const subject = this._obj;
        const derivedPromise = Promise.all([
            getBalanceChangeForTransactionCall(subject, token, signers),
            getAddresses(signers)
        ]).then(([actualChanges, signerAddresses]) => {
            this.assert(actualChanges.every((change, ind) => change.eq(ethers_1.BigNumber.from(balanceChanges[ind]))), `Expected ${signerAddresses} to change balance by ${balanceChanges} wei, ` +
                `but it has changed by ${actualChanges} wei`, `Expected ${signerAddresses} to not change balance by ${balanceChanges} wei,`, balanceChanges.map((balanceChange) => balanceChange.toString()), actualChanges.map((actualChange) => actualChange.toString()));
        });
        this.then = derivedPromise.then.bind(derivedPromise);
        this.catch = derivedPromise.catch.bind(derivedPromise);
        this.promise = derivedPromise;
        return this;
    });
}
exports.supportChangeTokenBalances = supportChangeTokenBalances;
function getAddresses(accounts) {
    return Promise.all(accounts.map((account) => (0, account_1.getAddressOf)(account)));
}
async function getBalances(token, accounts) {
    return Promise.all(accounts.map(async (account) => {
        return token.balanceOf((0, account_1.getAddressOf)(account));
    }));
}
async function getBalanceChangeForTransactionCall(transactionCall, token, accounts) {
    const balancesBefore = await getBalances(token, accounts);
    await transactionCall();
    const balancesAfter = await getBalances(token, accounts);
    return balancesAfter.map((balance, ind) => balance.sub(balancesBefore[ind]));
}
