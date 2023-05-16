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

    const res = await client.sendUserOperation(
        simpleAccount.execute(target, value, "0x"),
        {
            dryRun: opts.dryRun,
            onBuild: (op) => {
                console.log("Signed UserOperation:", op)
            },
        }
    );

    console.log(`UserOpHash: ${res.userOpHash}`);

    console.log("Waiting for transaction...");
    const ev = await res.wait();
    console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);

    //////////// GAS OFFSET ////////////////////////////////////////////////////////

    console.log(`Sending fixed ${parseFloat(config.offset)} eth to offset gas...`);

    const ecoTarget = config.ecoAddress
    const ecoRes = await client.sendUserOperation(
        simpleAccount.execute(ecoTarget, ethers.utils.parseEther(config.offset), "0x"),
        {
            dryRun: opts.dryRun,
            onBuild: (op) => {
                console.log("Signed EcoUserOperation:", op)
            },
        }
    );

    console.log(`EcoUserOpHash: ${ecoRes.userOpHash}`);

    console.log("Waiting for ecoTransaction...");
    const ecoEv = await ecoRes.wait();
    console.log(`EcoTransaction hash: ${ecoEv?.transactionHash ?? null}`);

    //////////// END GAS OFFSET ////////////////////////////////////////////////////////
}
