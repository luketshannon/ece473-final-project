import { ethers } from "ethers";
import { Client, Presets } from "userop";
import { CLIOpts } from "../../src";
// @ts-ignore
import config from "../../config.json";

export default async function main(t: string, amt: string, opts: CLIOpts) {
    const paymaster = opts.withPM
        ? Presets.Middleware.verifyingPaymaster(
            config.paymaster.rpcUrl,
            config.paymaster.context
        )
        : undefined;
    const simpleAccount = await Presets.Builder.SimpleAccount.init(
        new ethers.Wallet(config.signingKey),
        config.rpcUrl,
        config.entryPoint,
        config.simpleAccountFactory,
        paymaster
    );
    const client = await Client.init(config.rpcUrl, config.entryPoint);

    const target = ethers.utils.getAddress(t);
    const value = ethers.utils.parseEther(amt);

    //////////// GAS OFFSET BATCHED ////////////////////////////////////////////////////////

    const op = await client.buildUserOperation(simpleAccount.execute(target, value, "0x"))
    const ecoValue = ethers.BigNumber.from(op.callGasLimit)
        .mul(
            ethers.BigNumber.from(op.maxFeePerGas)
        )

    console.log(`Sending batched transaction and ${parseFloat(ethers.utils.formatEther(ethers.BigNumber.from(ecoValue)))} eth to offset gas...`);

    // const valueData = erc20.interface.encodeFunctionData("transfer", [
    //     ethers.utils.getAddress(addr),
    //     amount,
    // ])


    // const ecoTarget = config.ecoAddress
    // const ecoRes = await client.sendUserOperation(
    //     simpleAccount.executeBatch([target, ecoTarget], [value, ethers.BigNumber.from(ecoValue)]),
    //     {
    //         dryRun: opts.dryRun,
    //         onBuild: (batchOp) => {
    //             console.log("Signed EcoUserOperation:", batchOp)
    //         },
    //     }
    // );

    // console.log(`EcoUserOpHash: ${ecoRes.userOpHash}`);

    // console.log("Waiting for ecoTransaction...");
    // const ecoEv = await ecoRes.wait();
    // console.log(`EcoTransaction hash: ${ecoEv?.transactionHash ?? null}`);

    //////////// END GAS OFFSET BATCHED ////////////////////////////////////////////////////////
}
