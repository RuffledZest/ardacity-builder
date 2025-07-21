// utils/permaweb.ts
import Arweave from "arweave";
import { connect, createDataItemSigner } from "@permaweb/aoconnect";
import Permaweb from "@permaweb/libs";

export const initPermaweb = async () => {
  // Connect to ArConnect browser extension
  await window.arweaveWallet.connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION"]);

  // Initialize SDK
  const permaweb = Permaweb.init({
    ao: connect(),
    arweave: Arweave.init(),
    signer: createDataItemSigner(window.arweaveWallet),
  });

  return permaweb;
};
