import { PublicKey } from '@solana/web3.js'
import { Pda } from '@metaplex-foundation/umi'
import * as anchor from "@coral-xyz/anchor";
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Address, getProgramDerivedAddress, TransactionSigner } from 'gill';
import { CSP_VAULT, USER_PARTICIPATION } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ellipsify(str = '', len = 4, delimiter = '..') {
  const strLen = str.length
  const limit = len * 2 + delimiter.length

  return strLen >= limit ? str.substring(0, len) + delimiter + str.substring(strLen - len, strLen) : str
}

export function getCSPVaultAddress(vaultCreator: PublicKey, programAddress: Address) : { vaultAddress: PublicKey; bump: number; } {
  // const vaultCreatorAddress = typeof vaultCreator === 'string' 
  //   ? vaultCreator 
  //   : vaultCreator.address;

  const [pda, bump] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(CSP_VAULT),
      vaultCreator.toBuffer(),
    ], 
    new PublicKey(programAddress)
  );

  return { vaultAddress: pda, bump };
}
export function getUserParticipationAddress(vault: PublicKey, participant: PublicKey, nonce: number, programID: PublicKey) {
  const nonceBuffer = Buffer.alloc(8);
  nonceBuffer.writeBigUInt64LE(BigInt(nonce));

  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(USER_PARTICIPATION),
      vault.toBuffer(),
      participant.toBuffer(),
      nonceBuffer,
    ], programID);
}
