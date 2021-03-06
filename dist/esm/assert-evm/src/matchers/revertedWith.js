export function supportRevertedWith(Assertion) {
    Assertion.addMethod('revertedWith', function (revertReason) {
        const promise = this._obj;
        const onSuccess = (value) => {
            this.assert(false, 'Expected transaction to be reverted', 'Expected transaction NOT to be reverted', 'Transaction reverted.', 'Transaction NOT reverted.');
            return value;
        };
        const onError = (error) => {
            // See https://github.com/ethers-io/ethers.js/issues/829
            const isEstimateGasError = error instanceof Object &&
                error.code === 'UNPREDICTABLE_GAS_LIMIT' &&
                'error' in error;
            if (isEstimateGasError) {
                error = error.error;
            }
            const message = (error instanceof Object && 'message' in error) ? error.message : JSON.stringify(error);
            const isReverted = message.search('revert') >= 0 && message.search(revertReason) >= 0;
            const isThrown = message.search('invalid opcode') >= 0 && revertReason === '';
            this.assert(isReverted || isThrown, `Expected transaction to be reverted with ${revertReason}, but other exception was thrown: ${error}`, `Expected transaction NOT to be reverted with ${revertReason}`, `Transaction reverted with ${revertReason}.`, error);
            return error;
        };
        const derivedPromise = promise.then(onSuccess, onError);
        this.then = derivedPromise.then.bind(derivedPromise);
        this.catch = derivedPromise.catch.bind(derivedPromise);
        return this;
    });
}
