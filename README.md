# Assert Ethers Chai

> ethersjs compatible chai matchers, extracted from ethereum-waffle

Before you can start using the matchers, you have to tell chai to use the solidity plugin:

```js
import chai from "chai";
import { solidity } from "assert-ethers";

chai.use(solidity);
```

## Matchers

### BigInt

Testing equality of big numbers:

```js
expect(await token.balanceOf(wallet.address)).to.equal(993);
```
Available matchers for BigNumbers are: equal, eq, above, gt, gte, below, lt, lte, least, most, within, closeTo.

```js
expect(BigNumber.from(100)).to.be.within(BigNumber.from(99), BigNumber.from(101));
expect(BigNumber.from(100)).to.be.closeTo(BigNumber.from(101), 10);
```

### Emitting events

Testing what events were emitted with what arguments:
```js
await expect(token.transfer(walletTo.address, 7))
  .to.emit(token, 'Transfer')
  .withArgs(wallet.address, walletTo.address, 7);
```

> Note: The matcher will match `indexed` event parameters of type `string` or `bytes` even if the expected argument is not hashed using `keccack256` first.

Testing with indexed bytes or string parameters. These two examples are equivalent

```js
await expect(contract.addAddress("street", "city"))
  .to.emit(contract, 'AddAddress')
  .withArgs("street", "city");

const hashedStreet \= ethers.utils.keccak256(ethers.utils.toUtf8Bytes("street"));
const hashedCity \= ethers.utils.keccak256(ethers.utils.toUtf8Bytes("city"));
await expect(contract.addAddress(street, city))
  .to.emit(contract, 'AddAddress')
  .withArgs(hashedStreet, hashedCity);
```

### Called on contract

Testing if function was called on the provided contract:

await token.balanceOf(wallet.address)
```js
expect('balanceOf').to.be.calledOnContract(token);
```

### Called on contract with arguments

Testing if function with certain arguments was called on provided contract:

```js
await token.balanceOf(wallet.address)

expect('balanceOf').to.be.calledOnContractWith(token, \[wallet.address\]);
```

### Revert

Testing if transaction was reverted:

```js
await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;
```

### Revert with message

Testing if transaction was reverted with certain message:

```js
await expect(token.transfer(walletTo.address, 1007))
  .to.be.revertedWith('Insufficient funds');
```

### Change ether balance

Testing whether the transaction changes the balance of the account:

```js
await expect(() \=> wallet.sendTransaction({to: walletTo.address, value: 200}))
  .to.changeEtherBalance(walletTo, 200);

await expect(await wallet.sendTransaction({to: walletTo.address, value: 200}))
  .to.changeEtherBalance(walletTo, 200);
```

`expect` for `changeEtherBalance` gets one of the following parameters:

> Note `changeEtherBalance` won’t work if there is more than one transaction mined in the block.

The transaction call should be passed to the `expect` as a callback (we need to check the balance before the call) or as a transaction response.

The matcher can accept numbers, strings and BigNumbers as a balance change, while the account should be specified either as a Wallet or a Contract.

`changeEtherBalance` ignores transaction fees by default:

// Default behavior
await expect(await wallet.sendTransaction({to: walletTo.address, value: 200}))
  .to.changeEtherBalance(wallet, \-200);

// To include the transaction fee use:
await expect(await wallet.sendTransaction({to: walletTo.address, gasPrice: 1, value: 200}))
  .to.changeEtherBalance(wallet, \-21200, {includeFee: true});

Note

`changeEtherBalance` calls should not be chained. If you need to check changes of the balance for multiple accounts, you should use the `changeEtherBalances` matcher.

### Change ether balance (multiple accounts)

Testing whether the transaction changes balance of multiple accounts:

await expect(() \=> wallet.sendTransaction({to: walletTo.address, value: 200}))
  .to.changeEtherBalances(\[wallet, walletTo\], \[\-200, 200\]);

await expect(await wallet.sendTransaction({to: walletTo.address, value: 200}))
  .to.changeEtherBalances(\[wallet, walletTo\], \[\-200, 200\]);

Note

`changeEtherBalances` calls won’t work if there is more than one transaction mined in the block.

### Change token balance

Testing whether the transfer changes the balance of the account:

await expect(() \=> token.transfer(walletTo.address, 200))
  .to.changeTokenBalance(token, walletTo, 200);

await expect(() \=> token.transferFrom(wallet.address, walletTo.address, 200))
  .to.changeTokenBalance(token, walletTo, 200);

Note

The transfer call should be passed to the `expect` as a callback (we need to check the balance before the call).

The matcher can accept numbers, strings and BigNumbers as a balance change, while the account should be specified either as a Wallet or a Contract.

Note

`changeTokenBalance` calls should not be chained. If you need to check changes of the balance for multiple accounts, you should use the `changeTokenBalances` matcher.

### Change token balance (multiple accounts)

Testing whether the transfer changes balance for multiple accounts:

await expect(() \=> token.transfer(walletTo.address, 200))
  .to.changeTokenBalances(token, \[wallet, walletTo\], \[\-200, 200\]);

### Proper address

Testing if a string is a proper address:

expect('0x28FAA621c3348823D6c6548981a19716bcDc740e').to.be.properAddress;

### Proper private key

Testing if a string is a proper private key:

expect('0x706618637b8ca922f6290ce1ecd4c31247e9ab75cf0530a0ac95c0332173d7c5').to.be.properPrivateKey;

### Proper hex[

Testing if a string is a proper hex value of given length:

expect('0x70').to.be.properHex(2);

### Hex Equal


Testing if a string is a proper hex with value equal to the given hex value. Case insensitive and strips leading zeros:

expect('0x00012AB').to.hexEqual('0x12ab');

### Change balance


Deprecated since version 3.1.2: Use `changeEtherBalance()` instead.

Testing whether the transaction changes the balance of the account:

await expect(() \=> wallet.sendTransaction({to: walletTo.address, gasPrice: 0, value: 200}))
  .to.changeBalance(walletTo, 200);

await expect(await wallet.sendTransaction({to: walletTo.address, gasPrice: 0, value: 200}))
  .to.changeBalance(walletTo, 200);

`expect` for `changeBalance` gets one of the following parameters:

Note

`changeBalance` won’t work if there is more than one transaction mined in the block.

The transaction call should be passed to the `expect` as a callback (we need to check the balance before the call) or as a transaction response.

The matcher can accept numbers, strings and BigNumbers as a balance change, while the account should be specified either as a Wallet or a Contract.

Note

`changeBalance` calls should not be chained. If you need to check changes of the balance for multiple accounts, you should use the `changeBalances` matcher.

## Change balance (multiple accounts)

Deprecated since version 3.1.2: Use `changeEtherBalances()` instead.

Testing whether the transaction changes balance of multiple accounts:

await expect(() \=> wallet.sendTransaction({to: walletTo.address, gasPrice: 0, value: 200}))
  .to.changeBalances(\[wallet, walletTo\], \[\-200, 200\]);

await expect(await wallet.sendTransaction({to: walletTo.address, gasPrice: 0, value: 200}))
  .to.changeBalances(\[wallet, walletTo\], \[\-200, 200\]);

Note

`changeBalances` calls won’t work if there is more than one transaction mined in the block.


## Acknowledgements

Thanks to `ethereum-waffle` which this library was originally extracted from