import { Injectable } from '@angular/core';
import
{
    Account,
    Asset,
    BASE_FEE,
    Contract,
    Keypair,
    Networks,
    TransactionBuilder,
    rpc,
    scValToNative,
    xdr,
    Address,
    Utils,
} from '@stellar/stellar-sdk';

import { getAddress } from "@stellar/freighter-api";
import { getNetworkDetails } from "@stellar/freighter-api";
import { isConnected, requestAccess, signTransaction } from '@stellar/freighter-api';

// import Server from '@stellar/stellar-sdk';

// import   from '@stellar/stellar-sdk';

import { OracleAssetConfig } from '../../../environments/environment.base';
import { environment } from '../../../environments/environment';

export interface OraclePricePoint
{
    readonly price: number;
    readonly rawPrice: bigint;
    readonly timestamp: number;
    readonly rawTimestamp: bigint;
}

type OracleResult =
    | { price: bigint; timestamp?: bigint }
    | null;

// function decodeOracleResult(retval: xdr.ScVal): OracleResult
// {
//     const native = scValToNative(retval);

//     if (typeof native === 'bigint')
//     {
//         return { price: native };
//     }

//     if (Array.isArray(native))
//     {
//         const [p, t] = native;
//         if (typeof p === 'bigint')
//         {
//             return { price: p, timestamp: typeof t === 'bigint' ? t : undefined };
//         }
//     }

//     if (native && typeof native === 'object')
//     {
//         // Pode vir Map(...) → transforme para objeto simples
//         const m = native instanceof Map ? Object.fromEntries(native) : native as any;
//         const price = m.price ?? m._price ?? m[0];
//         const ts = m.timestamp ?? m.ts ?? m[1];
//         if (typeof price === 'bigint')
//         {
//             return { price, timestamp: typeof ts === 'bigint' ? ts : undefined };
//         }
//     }

//     return null;
// }

// function decodeLastPrice(retval: xdr.ScVal): OracleResult
// {
//     const native = scValToNative(retval);

//     console.log("decodeLastPrice | native =", native);

//     if (native === null)
//     {
//         // None (scvVoid) -> sem dado
//         return null;
//     }

//     // Caso 1: já vem como objeto { price, timestamp }
//     if (typeof native === "object" && native !== null)
//     {
//         const price = (native as any).price;
//         const ts = (native as any).timestamp;

//         if (typeof price === "bigint")
//         {
//             return {
//                 price,
//                 timestamp: typeof ts === "bigint" ? ts : 0n,
//             };
//         }
//     }

//     // Caso 2: veio como Map
//     if (native instanceof Map)
//     {
//         const price = native.get("price") ?? native.get(Symbol.for("price"));
//         const ts = native.get("timestamp") ?? native.get(Symbol.for("timestamp"));

//         if (typeof price === "bigint")
//         {
//             return { price, timestamp: typeof ts === "bigint" ? ts : 0n };
//         }
//     }

//     throw new Error("Unexpected oracle return shape: " + JSON.stringify(native));
// }

@Injectable({ providedIn: 'root' })
export class OracleService
{
    private readonly networkPassphrase = environment.stellar.networkPassphrase;
    private readonly server = new rpc.Server(environment.stellar.sorobanRpcUrl, {
        allowHttp: environment.stellar.sorobanRpcUrl.startsWith('http://'),
    });
    private readonly contractId: string;
    private readonly method = environment.oracle.reflector.method ?? 'lastprice';
    private readonly decimals = environment.oracle.reflector.decimals ?? 7;
    // private readonly targetAsset = environment.oracle.reflector.targetAsset;
    private readonly targetAsset = environment.oracle.reflector.baseAsset;

    constructor()
    {
        const resolvedContractId =
            environment.oracle.reflector.contractIdXlmUsdc ?? environment.oracle.reflector.contractIdXlmUsdt;
        if (!resolvedContractId)
        {
            throw new Error('Reflector contract ID is not configured in the environment.');
        }
        this.contractId = resolvedContractId;
    }

    async fetchLatestPrice(): Promise<OraclePricePoint>
    {
        const contractId = 'CAVLP5DH2GJPZMVO7IJY4CVOD5MWEFTJFVPD2YY2FQXOQHRGHK4D6HLP';
        const contract = new Contract(contractId);

        // let idk02 = this.buildAssetScVal(this.targetAsset);
        let idk02 = xdr.ScVal.scvVec([
            xdr.ScVal.scvSymbol('Stellar'),
            // new Address("CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC").toScVal(),
            new Address("CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC").toScVal(),
        ]);

        // // Right now, this is just the default fee for this example.
        // // const account = new Account(Keypair.random().publicKey(), '0');
        // await this.server.getAccount('GB6REF3X').then((res) =>
        // {
        //     console.log("##### res:", res);
        // });


        // const accountResponse = await this.server.loadAccount(pubKey);
        // const accountResponse = await this.server.loadAccount(Utils.key);
        let addressValue = await getAddress();

        if (addressValue instanceof Error)
        {
            let addressValueError = addressValue as Error;
            console.error('Failed to get address from Freighter: ' + addressValueError.message);
            throw addressValueError;
        }

        if (!addressValue || !addressValue.address)
            throw new Error('Failed to get address from Freighter! 01-02');


        // let pubKey: string = addressValue.address;


        const accountResponse = await this.server.getAccount(addressValue.address);
        const account = new Account(accountResponse.accountId(), accountResponse.sequenceNumber());

        console.log("##### addressValue:", addressValue);
        console.log("##### accountResponse:", accountResponse);
        console.log("##### account:", account);

        const fee = BASE_FEE;
        const transaction = new TransactionBuilder(
            account,
            {
                // fee,
                fee: BASE_FEE,
                networkPassphrase: this.networkPassphrase,
            })
            // Uncomment the following line to build transactions for the live network. Be
            // sure to also change the horizon hostname.
            //.setNetworkPassphrase(StellarSdk.Networks.PUBLIC)
            .setNetworkPassphrase(Networks.TESTNET)
            .setTimeout(30) // valid for the next 30s
            // Add an operation to call increment() on the contract
            .addOperation(contract.call("lastprice", idk02))
            .build();

        // // this.server.simulateTransaction(transaction).then((sim: SimulateTransactionResponse) =>
        // this.server.simulateTransaction(transaction).then((sim: rpc.Api.SimulateTransactionResponse) =>
        // {
        //     // console.log("cost:", sim.cost);
        //     // console.log("result:", sim.result);
        //     // console.log("error:", sim.error);
        //     // console.log("latestLedger:", sim.latestLedger);
        //     console.log("##### sim:", sim);

        //     // if (sim.result)
        //     // {

        //     // }

        //     // const out = decodeLastPrice(sim.result.retval);
        // });

        if (!(await this.ensureFreighterAvailable()))
        {
            throw new Error('Freighter wallet is not available or is locked.');
        }

        const accessResponse = await requestAccess();
        if (!accessResponse || !('address' in accessResponse) || !accessResponse.address)
        {
            const message = (accessResponse as any)?.error?.message ?? 'Wallet access was rejected.';
            throw new Error(message);
        }
        const publicKey = accessResponse.address;

        // const challenge = await firstValueFrom(
        //     this.http.get<Sep10ChallengeResponse>(`${environment.apiBaseUrl}/auth/sep10`, {
        //         params: new HttpParams().set('clientPublicKey', publicKey).set('account', publicKey),
        //     }),
        // );

        // const networkPassphrase = challenge.networkPassphrase || environment.stellar.networkPassphrase;
        // const signatureResponse = await signTransaction(transaction, {
        //     networkPassphrase,
        //     address: publicKey,
        // });

        // transaction.addSignature()

        await this.server.simulateTransaction(transaction).then((sim: rpc.Api.SimulateTransactionResponse) =>
        {
            console.log("##### sim:", sim);

            transaction
        });

        await this.server.sendTransaction(transaction).then((res: rpc.Api.SendTransactionResponse) =>
        {
            console.log("##### res:", res);
            console.log("##### res.diagnosticEvents?.toLocaleString:", res.diagnosticEvents?.toLocaleString());
            console.log("##### res.diagnosticEvents?.toString:", res.diagnosticEvents?.toString);

            console.log("##### res.errorResult?:", res.errorResult);
            console.log("##### res.errorResult?.ext.toString():", res.errorResult?.ext.toString());
            console.log("##### res.errorResult?.result?.toString():", res.errorResult?.result?.toString());
        });

        throw new Error('Not implemented yet.');

        // throw new Error('Not implemented yet.');

        // const contractId = 'CAVLP5DH2GJPZMVO7IJY4CVOD5MWEFTJFVPD2YY2FQXOQHRGHK4D6HLP'; // testnet reflector oracle pubnet contract
        // const contract = new Contract(contractId);
        // const fee = BASE_FEE;

        // // const contract = new Contract(this.contractId);
        // const account = new Account(Keypair.random().publicKey(), '0');

        // console.log('targetAsset = ', this.targetAsset);
        // let idk02 = this.buildAssetScVal(this.targetAsset);
        // console.log('idk02 = ', idk02);



        // const transaction = new TransactionBuilder(account, {
        //     // fee: String(BASE_FEE),                    // ✅ fee como string
        //     fee: BASE_FEE,                    // ✅ fee como string
        //     networkPassphrase: this.networkPassphrase,
        // })
        //     // .addOperation(contract.call(this.method, this.buildAssetScVal(this.targetAsset)))
        //     .addOperation(contract.call(this.method, idk02))
        //     .setTimeout(30)
        //     .build();

        // // const simulation = await this.server.simulateTransaction(transaction);
        // // simulation._parsed = decodeOracleResult(simulation.result?.retval
        // const simulation = await this.server.sendTransaction(transaction);
        // this.server.trans

        // console.log('simulation = ', simulation);
        // throw new Error('Oracle returned an empty response.');

        // // if ('error' in simulation && simulation.error)
        // // {
        // //     throw new Error(`Oracle simulation failed: ${simulation.error}`);
        // // }

        // // if (!('result' in simulation) || !simulation.result?.retval)
        // // {
        // //     throw new Error('Oracle returned an empty response.');
        // // }


        // // // const native = scValToNative(simulation.result.retval) as { price: bigint; timestamp: bigint } | null;
        // // // if (!native || typeof native.price === 'undefined' || typeof native.timestamp === 'undefined')
        // // // {
        // // //     throw new Error('Oracle returned unexpected data.');
        // // // }

        // // // const price = Number(native.price) / Math.pow(10, this.decimals);
        // // // const timestamp = Number(native.timestamp) * 1000;

        // // // return {
        // // //     price,
        // // //     rawPrice: native.price,
        // // //     timestamp,
        // // //     rawTimestamp: native.timestamp!,
        // // // };

        // // const out = decodeLastPrice(simulation.result.retval);

        // // if (!out)
        // // {
        // //     console.log("simulation.result = ", simulation.result);
        // //     console.warn("Oracle returned None (no data yet).");
        // // } else
        // // {
        // //     console.log("Price:", out.price.toString(), "Timestamp:", out.timestamp);
        // // }

        // // if (!out)
        // // {
        // //     // console.error('simulation.result = ', simulation.result);

        // //     // fallback: tentar extrair de diagnostic events (ver abaixo)
        // //     throw new Error('Oracle returned unexpected shape (void/diagnostic).');
        // // }

        // // const price = Number(out.price) / Math.pow(10, this.decimals);
        // // const timestamp = Number(out.timestamp) * 1000;

        // // return {
        // //     price,
        // //     rawPrice: out.price,
        // //     timestamp,
        // //     rawTimestamp: out.timestamp!,
        // // };
    }


    private async ensureFreighterAvailable(): Promise<boolean>
    {
        try
        {
            const response = await isConnected();
            if (response?.error)
            {
                console.error('Failed to detect Freighter extension.', response.error);
                return false;
            }
            return Boolean(response?.isConnected);
        } catch (error)
        {
            console.error('Failed to detect Freighter extension.', error);
            return false;
        }
    }


    // private buildAssetScVal(config: OracleAssetConfig): xdr.ScVal
    // {
    //     console.log("09-02-01 | config = ", config);

    //     if (config.type === 'native')
    //     {
    //         console.log("09-02-02 | config = ", config);
    //         const contractId = Asset.native().contractId(this.networkPassphrase);
    //         return this.buildStellarAssetScVal(contractId);
    //     }

    //     if (config.type === 'stellar')
    //     {
    //         if (!config.issuer)
    //         {
    //             throw new Error(`Missing issuer for asset ${config.code}`);
    //         }

    //         // const contractId = new Asset(config.code, config.issuer).contractId(this.networkPassphrase);
    //         // console.log("09-02-03 | config = ", config);
    //         // return this.buildStellarAssetScVal(contractId);

    //         return xdr.ScVal.scvVec([
    //             xdr.ScVal.scvSymbol('Stellar'),
    //             // new Address("CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC").toScVal(),
    //             new Address("CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC").toScVal(),
    //         ]);
    //     }

    //     console.log("09-03 | config = ", config);

    //     return xdr.ScVal.scvVec([
    //         // xdr.ScVal.scvSymbol('Other'),
    //         // xdr.ScVal.scvSymbol(config.code),
    //         // xdr.ScVal.scvSymbol("CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"),
    //         new Address("CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC").toScVal(),
    //     ]);
    // }

    // private buildStellarAssetScVal(contractId: string): xdr.ScVal
    // {
    //     console.log("09-01 | contractId = ", contractId);
    //     return xdr.ScVal.scvVec([
    //         xdr.ScVal.scvSymbol('Stellar'),
    //         // new Address("CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC").toScVal(),
    //         new Address("CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC").toScVal(),
    //     ]);
    // }
}
