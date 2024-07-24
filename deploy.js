import { TurboFactory, ArweaveSigner } from '@ardrive/turbo-sdk';
import fs from "fs";
import path from 'path';

// load Arweave wallet
const wallet = JSON.parse(
  fs.readFileSync(process.env.WALLET, 'utf-8')
);

const main = async () => {
  const signer = new ArweaveSigner(wallet);
  const turbo = TurboFactory.authenticated({ signer });
  const _file = path.resolve('./aos/process/process.wasm')
  const receipt = await turbo.uploadFile({
    fileSizeFactory: () => fs.statSync(_file).size,
    fileStreamFactory: () => fs.createReadStream(_file),
    dataItemOpts: {
      tags: [
        { name: 'Content-Type', value: 'application/wasm' },
        { name: 'Data-Protocol', value: 'ao' },
        { name: 'Type', value: 'Module' },
        { name: 'Variant', value: 'ao.TN.1' },
        { name: 'Module-Format', value: 'wasm64-unknown-emscripten-draft_2024_02_15' },
        { name: 'Input-Encoding', value: 'JSON-1' },
        { name: 'Output-Encoding', value: 'JSON-1' },
        { name: 'Memory-Limit', value: '1-gb' },
        { name: 'Compute-Limit', value: '9000000000000' }
      ]
    }
  });
  console.log(receipt);
  console.log('ModuleID: ', receipt.id)
}

main()