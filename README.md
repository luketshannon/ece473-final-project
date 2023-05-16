# ERC4337 Final Project

### Instructions:

To begin using this project, run:
```
$ yarn install
```
You can also view more detailed instructions on starting this project under [Stackup's readme](./erc-4337-examples/README.md). (Make sure to save the `config.json` file we have provided, however.)

If you would like to change the config file you can change:
1. `ecoAddress: luke-goerli.eth` the address the donations go to
2. `offset: 0.001`: change the fixed donation amount
3. `roundTo: 0.001`: change the rounding number

in `config.json` to customize these parameters.


You can also run any of these commands with `--help`, they have similar options.
```
Usage: ERC-4337 SimpleAccount ecoTransfer [options]

Transfer ETH and offset equivalent environmental cost

Options:
  -dr, --dryRun         Builds the UserOperation without calling eth_sendUserOperation
  -pm, --withPaymaster  Use a paymaster for this transaction
  -t, --to <address>    The recipient address
  -amt, --amount <eth>  Amount in ETH to transfer
  -h, --help            display help for command
```

## Automatic Carbon Offset Wallet: ecoTransfer()
#### Transfer ETH and offset equivalent environmental cost

This function calculates the `callGasLimit` and `maxFeePerGas` for an ether transfer, and sends double the equivalent amount of ether to `ecoAddress` to offset the carbon cost of the transaction.

Example usage:
```
$ yarn run simpleAccount ecoTransfer --to 0xE188ae79149fb7441c854CbDb61ebb4be1a18a4e --amount 0.001
```

## Automatic Donation Wallet: ecoTransferFixed()
#### Transfer ETH and fixed offset for environmental cost

This function transfersa a fixed amount `offset` of eth to `ecoAddress` in order to offset the environmental cost of the transactions or donate to an arbitrary on-chain cause (e.g. water rights).

Example usage:
```
$ yarn run simpleAccount ecoTransferFixed --to 0xE188ae79149fb7441c854CbDb61ebb4be1a18a4e --amount 0.001
```

## Automatic Rounding Donation Wallet: roundTransfer()
#### Transfer ETH and send excess after rounding up to nearest 0.001"

This function automatically rounds each transaction the user sends to the nearest `roundTo` eth, and sends it to `ecoAddress` to offset environmental costs or send donations.

Example usage:
```
$ yarn run simpleAccount roundTransfer --to 0xE188ae79149fb7441c854CbDb61ebb4be1a18a4e --amount 0.0003
```