import * as anchor from "@coral-xyz/anchor";
import { BN, BorshAccountsCoder, Program } from "@coral-xyz/anchor";
import { Crowdsol } from "../target/types/crowdsol";
import { ComputeBudgetProgram, PublicKey, Transaction } from "@solana/web3.js";
import { assert, expect } from "chai";
import { LiteSVM, TransactionMetadata } from "litesvm";
import { SystemProgram } from "@solana/web3.js";

const CSP_VAULT = "csp_vault";
const USER_PARTICIPATION = "user_participation";

const TITLE_LENGTH = new BN(50);
const DESC_LENGTH = new BN(500);
const COMMENT_LENGTH = new BN(200);
const MIN_DURATION = new BN(604800); // 1 week in seconds
const MAX_DURATION = new BN(7889238); // 3 months in seconds

describe("crowdsol", () => {
  // let provider: anchor.AnchorProvider;
  let program: Program<Crowdsol>;
  let bob: anchor.web3.Keypair;
  let alice: anchor.web3.Keypair;
  let charlie: anchor.web3.Keypair;
  let svm: LiteSVM;

  const ID = new PublicKey("8tyRHod4FeXM6ZH4ELCm3JifjsKCd1A7fAPJZrxAqJEw");
  program = anchor.workspace.crowdsol as Program<Crowdsol>;
  const coder = new BorshAccountsCoder(program.idl);

  const oneMonth = new BN(2629743); // seconds in a month
  const oneYear = new BN(31556952); // seconds in a month
  const oneSecond = new BN(1); 

  const oneSol = new BN(1000000000);
  const twoSol = new BN(2000000000);
  const tenSol = new BN(10000000000);

  const title = "Save the Rainforest";
  const titleTooLong = title.repeat(15);
  const description = "Help us protect the rainforest by funding our conservation efforts.";
  const descriptionTooLong = description.repeat(10);

  const comment = "Nice project!";
  const commentTooLong = comment.repeat(20);

  beforeEach(async () => {
    svm = new LiteSVM();
    bob = anchor.web3.Keypair.generate();
    alice = anchor.web3.Keypair.generate();
    charlie = anchor.web3.Keypair.generate();
    svm.airdrop(bob.publicKey, BigInt(10_000_000_000));
    svm.airdrop(alice.publicKey, BigInt(10_000_000_000));
    svm.airdrop(charlie.publicKey, BigInt(10_000_000_000));
    svm.addProgramFromFile(ID, "target/deploy/crowdsol.so");


    const initialClock = svm.getClock();
    initialClock.unixTimestamp = BigInt(1735689600); // Jan 1, 2025
    svm.setClock(initialClock);
    // console.log("Clock updated to:", svm.getClock().unixTimestamp.toString());
  });

  describe("Create funding", () => {
    it("Create a funding", async () => {

      const [vaultPkey, vaultBump] = getCSPVaultAddress(bob.publicKey, ID);

      let ix = await program.methods.createCrowdfunding(oneMonth, tenSol, title, description).accounts(
        {
          vaultCreator: bob.publicKey,
          vault: vaultPkey,
          systemProgram: SystemProgram.programId
        }
      )
      .instruction();

      const tx = new Transaction().add(ix);
      tx.recentBlockhash = svm.latestBlockhash();
      tx.feePayer = bob.publicKey;
      tx.sign(bob);
      const txResult = await svm.sendTransaction(tx);

      if (txResult instanceof TransactionMetadata) {
        // console.log(txResult.logs()[1]);
      } else {
        console.log("Transaction failed:", txResult.toString());
        throw new Error("Unexpected tx failure");
      }

      await checkVault(
        svm, coder, program, vaultPkey, bob.publicKey, oneMonth, title, description, new BN(0), tenSol, new BN(0), true, vaultBump
      )
    });

    it("Create a funding should fail with shorter duration", async () => {
      const [vaultPkey, vaultBump] = getCSPVaultAddress(bob.publicKey, program.programId);

      let ix = await program.methods.createCrowdfunding(oneSecond, tenSol, title, description).accounts(
        {
          vaultCreator: bob.publicKey,
          vault: vaultPkey,
          systemProgram: SystemProgram.programId
        }
      )
      .instruction();

      const tx = new Transaction().add(ix);
      tx.recentBlockhash = svm.latestBlockhash();
      tx.feePayer = bob.publicKey;
      tx.sign(bob);
      const txResult = await svm.sendTransaction(tx);

      if (txResult instanceof TransactionMetadata) {
        // console.log(txResult.logs()[1]);
      } else {
        // console.log("Transaction failed:", txResult.toString());
        expect(txResult.toString()).to.have.string("DurationTooShort");
      }
    });

    it("Create a funding should fail with higher duration", async () => {

      const [vaultPkey, vaultBump] = getCSPVaultAddress(bob.publicKey, program.programId);

      let ix = await program.methods.createCrowdfunding(oneYear, tenSol, title, description).accounts(
        {
          vaultCreator: bob.publicKey,
          vault: vaultPkey,
          systemProgram: SystemProgram.programId
        }
      )
      .instruction();

      const tx = new Transaction().add(ix);
      tx.recentBlockhash = svm.latestBlockhash();
      tx.feePayer = bob.publicKey;
      tx.sign(bob);
      const txResult = await svm.sendTransaction(tx);

      if (txResult instanceof TransactionMetadata) {
        // console.log(txResult.logs()[1]);
      } else {
        // console.log("Transaction failed:", txResult.toString());
        expect(txResult.toString()).to.have.string("DurationTooLong");
      }
    });

    it("Create a funding should fail with too long title", async () => {

      const [vaultPkey, vaultBump] = getCSPVaultAddress(bob.publicKey, program.programId);

      let ix = await program.methods.createCrowdfunding(oneMonth, tenSol, titleTooLong, description).accounts(
        {
          vaultCreator: bob.publicKey,
          vault: vaultPkey,
          systemProgram: SystemProgram.programId
        }
      )
      .instruction();

      const tx = new Transaction().add(ix);
      tx.recentBlockhash = svm.latestBlockhash();
      tx.feePayer = bob.publicKey;
      tx.sign(bob);
      const txResult = await svm.sendTransaction(tx);

      if (txResult instanceof TransactionMetadata) {
        // console.log(txResult.logs()[1]);
      } else {
        // console.log("Transaction failed:", txResult.toString());
        expect(txResult.toString()).to.have.string("TitleWrongLength");
      }
    });

    it("Create a funding should fail with too long description", async () => {

      const [vaultPkey, vaultBump] = getCSPVaultAddress(bob.publicKey, program.programId);

      let ix = await program.methods.createCrowdfunding(oneMonth, tenSol, title, descriptionTooLong).accounts(
        {
          vaultCreator: bob.publicKey,
          vault: vaultPkey,
          systemProgram: SystemProgram.programId
        }
      )
      .instruction();

      const tx = new Transaction().add(ix);
      tx.recentBlockhash = svm.latestBlockhash();
      tx.feePayer = bob.publicKey;
      tx.sign(bob);
      const txResult = await svm.sendTransaction(tx);

      if (txResult instanceof TransactionMetadata) {
        // console.log(txResult.logs()[1]);
      } else {
        // console.log("Transaction failed:", txResult.toString());
        expect(txResult.toString()).to.have.string("DescriptionWrongLength");
      }
    });
  });

  describe("Donate", () => {
    it("Donate to a funding", async () => {
      const [vaultPkey, vaultBump] = getCSPVaultAddress(bob.publicKey, ID);

      let ix = await program.methods.createCrowdfunding(oneMonth, tenSol, title, description).accounts(
        {
          vaultCreator: bob.publicKey,
          vault: vaultPkey,
          systemProgram: SystemProgram.programId
        }
      )
      .instruction();

      const tx = new Transaction().add(ix);
      tx.recentBlockhash = svm.latestBlockhash();
      tx.feePayer = bob.publicKey;
      tx.sign(bob);
      const txResult = await svm.sendTransaction(tx);

      if (txResult instanceof TransactionMetadata) {
        // console.log(txResult.logs()[1]);
      } else {
        console.log("Transaction failed:", txResult.toString());
        throw new Error("Unexpected tx failure");
      }

      await checkVault(
        svm, coder, program, vaultPkey, bob.publicKey, oneMonth, title, description, new BN(0), tenSol, new BN(0), true, vaultBump
      )

      const [aliceParticipationPkey, aliceParticipationBump] = getUserParticipationAddress(vaultPkey, alice.publicKey, 0, ID);

      let ixDonateAlice = await program.methods.donate(oneSol, comment).accounts(
        {
          participant: alice.publicKey,
          participation: aliceParticipationPkey,
          vault: vaultPkey,
          systemProgram: SystemProgram.programId
        }
      )
      .instruction();

      const txAlice = new Transaction().add(ixDonateAlice);
      txAlice.recentBlockhash = svm.latestBlockhash();
      txAlice.feePayer = alice.publicKey;
      txAlice.sign(alice);
      const txResultAlice = await svm.sendTransaction(txAlice);

      if (txResultAlice instanceof TransactionMetadata) {
        // console.log(txResultAlice.logs()[1]);
      } else {
        console.log("Transaction failed:", txResultAlice.toString());
        throw new Error("Unexpected tx failure");
      } 

      await checkVault(
         svm, coder, program, vaultPkey, bob.publicKey, oneMonth, title, description, oneSol, tenSol, new BN(1), true, vaultBump
      )
      await checkUserParticipation(
        svm, coder, program, aliceParticipationPkey, alice.publicKey, vaultPkey, oneSol, comment, new BN(0), aliceParticipationBump
      )
    });

    it("Donate to a funding should fail if comment is too long", async () => {
      const [vaultPkey, vaultBump] = getCSPVaultAddress(bob.publicKey, ID);

      let ix = await program.methods.createCrowdfunding(oneMonth, tenSol, title, description).accounts(
        {
          vaultCreator: bob.publicKey,
          vault: vaultPkey,
          systemProgram: SystemProgram.programId
        }
      )
      .instruction();

      const tx = new Transaction().add(ix);
      tx.recentBlockhash = svm.latestBlockhash();
      tx.feePayer = bob.publicKey;
      tx.sign(bob);
      const txResult = await svm.sendTransaction(tx);

      if (txResult instanceof TransactionMetadata) {
        // console.log(txResult.logs()[1]);
      } else {
        console.log("Transaction failed:", txResult.toString());
        throw new Error("Unexpected tx failure");
      }

      await checkVault(
        svm, coder, program, vaultPkey, bob.publicKey, oneMonth, title, description, new BN(0), tenSol, new BN(0), true, vaultBump
      )

      const [aliceParticipationPkey, aliceParticipationBump] = getUserParticipationAddress(vaultPkey, alice.publicKey, 0, ID);

      let ixDonateAlice = await program.methods.donate(oneSol, commentTooLong).accounts(
        {
          participant: alice.publicKey,
          participation: aliceParticipationPkey,
          vault: vaultPkey,
          systemProgram: SystemProgram.programId
        }
      )
      .instruction();

      const txAlice = new Transaction().add(ixDonateAlice);
      txAlice.recentBlockhash = svm.latestBlockhash();
      txAlice.feePayer = alice.publicKey;
      txAlice.sign(alice);
      const txResultAlice = await svm.sendTransaction(txAlice);

      if (txResultAlice instanceof TransactionMetadata) {
        // console.log(txResultAlice.logs()[1]);
      } else {
        // console.log("Transaction failed:", txResultAlice.toString());
        expect(txResultAlice.toString()).to.have.string("CommentWrongLength");
      } 
    });

    it("Donate to a funding should fail if amount is zero", async () => {
      const [vaultPkey, vaultBump] = getCSPVaultAddress(bob.publicKey, ID);

      let ix = await program.methods.createCrowdfunding(oneMonth, tenSol, title, description).accounts(
        {
          vaultCreator: bob.publicKey,
          vault: vaultPkey,
          systemProgram: SystemProgram.programId
        }
      )
      .instruction();

      const tx = new Transaction().add(ix);
      tx.recentBlockhash = svm.latestBlockhash();
      tx.feePayer = bob.publicKey;
      tx.sign(bob);
      const txResult = await svm.sendTransaction(tx);

      if (txResult instanceof TransactionMetadata) {
        // console.log(txResult.logs()[1]);
      } else {
        console.log("Transaction failed:", txResult.toString());
        throw new Error("Unexpected tx failure");
      }

      await checkVault(
        svm, coder, program, vaultPkey, bob.publicKey, oneMonth, title, description, new BN(0), tenSol, new BN(0), true, vaultBump
      )

      const [aliceParticipationPkey, aliceParticipationBump] = getUserParticipationAddress(vaultPkey, alice.publicKey, 0, ID);

      let ixDonateAlice = await program.methods.donate(new BN(0), comment).accounts(
        {
          participant: alice.publicKey,
          participation: aliceParticipationPkey,
          vault: vaultPkey,
          systemProgram: SystemProgram.programId
        }
      )
      .instruction();

      const txAlice = new Transaction().add(ixDonateAlice);
      txAlice.recentBlockhash = svm.latestBlockhash();
      txAlice.feePayer = alice.publicKey;
      txAlice.sign(alice);
      const txResultAlice = await svm.sendTransaction(txAlice);

      if (txResultAlice instanceof TransactionMetadata) {
        console.log(txResultAlice.logs()[1]);
      } else {
        // console.log("Transaction failed:", txResultAlice.toString());
        expect(txResultAlice.toString()).to.have.string("AmountZero");
      } 
    });
  });

  describe("Withdraw funding", () => {
    it("Withdraw from a funding", async () => {
      const [vaultPkey, vaultBump] = getCSPVaultAddress(bob.publicKey, ID);

      let ix = await program.methods.createCrowdfunding(oneMonth, tenSol, title, description).accounts(
        {
          vaultCreator: bob.publicKey,
          vault: vaultPkey,
          systemProgram: SystemProgram.programId
        }
      )
      .instruction();

      const tx = new Transaction().add(ix);
      tx.recentBlockhash = svm.latestBlockhash();
      tx.feePayer = bob.publicKey;
      tx.sign(bob);
      const txResult = await svm.sendTransaction(tx);

      if (txResult instanceof TransactionMetadata) {
        // assert.strictEqual(txResult.logs()[1], "Program log: static string");
        // console.log(txResult.logs()[1]);
      } else {
        console.log("Transaction failed:", txResult.toString());
        throw new Error("Unexpected tx failure");
    }

      // Alice donate
      const [aliceParticipationPkey, alicePaticipationBump] = getUserParticipationAddress(vaultPkey, alice.publicKey, 0, ID);

      let ixDonateAlice = await program.methods.donate(oneSol, comment).accounts(
        {
          participant: alice.publicKey,
          participation: aliceParticipationPkey,
          vault: vaultPkey,
          systemProgram: SystemProgram.programId
        }
      )
      .instruction();

      const txAlice = new Transaction().add(ixDonateAlice);
      txAlice.recentBlockhash = svm.latestBlockhash();
      txAlice.feePayer = alice.publicKey;
      txAlice.sign(alice);
      const txResultAlice = await svm.sendTransaction(txAlice);

      if (txResultAlice instanceof TransactionMetadata) {
        // console.log(txResultAlice.logs()[1]);
      } else {
        console.log("Transaction failed:", txResultAlice.toString());
        throw new Error("Unexpected tx failure");
      } 

      // Charlie donate
      const [charlieParticipationPkey, charliePaticipationBump] = getUserParticipationAddress(vaultPkey, charlie.publicKey, 1, ID);

      let ixDonateCharlie = await program.methods.donate(oneSol, comment).accounts(
        {
          participant: charlie.publicKey,
          participation: charlieParticipationPkey,
          vault: vaultPkey,
          systemProgram: SystemProgram.programId
        }
      )
      .instruction();

      const txCharlie = new Transaction().add(ixDonateCharlie);
      txCharlie.recentBlockhash = svm.latestBlockhash();
      txCharlie.feePayer = charlie.publicKey;
      txCharlie.sign(charlie);
      const txResultCharlie = await svm.sendTransaction(txCharlie);

      if (txResultCharlie instanceof TransactionMetadata) {
        // console.log(txResultCharlie.logs()[1]);
      } else {
        console.log("Transaction failed:", txResultCharlie.toString());
        throw new Error("Unexpected tx failure");
      } 

      await checkVault(
        svm, coder, program, vaultPkey, bob.publicKey, oneMonth, title, description, twoSol, tenSol, new BN(2), true, vaultBump
      )

      // Advance time beyond the funding duration
      const newClock = svm.getClock();
      newClock.unixTimestamp = BigInt(1735689600 + oneMonth.toNumber() + 10);
      svm.setClock(newClock);

      // console.log("Clock updated to:", svm.getClock().unixTimestamp.toString());

      // Withdraw funding
      let ixWithdraw = await program.methods.withdraw().accounts(
        {
          owner: bob.publicKey,
          vault: vaultPkey,
          systemProgram: SystemProgram.programId
        }
      )
      .instruction();

      const txWithdraw = new Transaction().add(ixWithdraw);
      txWithdraw.recentBlockhash = svm.latestBlockhash();
      txWithdraw.feePayer = bob.publicKey;
      txWithdraw.sign(bob);
      const txResultWithdraw = await svm.sendTransaction(txWithdraw);

      if (txResultWithdraw instanceof TransactionMetadata) {
        // console.log(txResultWithdraw.logs()[1]);
      } else {
        console.log("Transaction failed:", txResultWithdraw.toString());
        throw new Error("Unexpected tx failure");
      } 

      await checkVault(
        svm, coder, program, vaultPkey, bob.publicKey, oneMonth, title, description, new BN(0), tenSol, new BN(2), false, vaultBump
      )
    });

    it("Withdraw from a funding should fail if it's not the owner", async () => {
      const [vaultPkey, vaultBump] = getCSPVaultAddress(bob.publicKey, ID);

      let ix = await program.methods.createCrowdfunding(oneMonth, tenSol, title, description).accounts(
        {
          vaultCreator: bob.publicKey,
          vault: vaultPkey,
          systemProgram: SystemProgram.programId
        }
      )
      .instruction();

      const tx = new Transaction().add(ix);
      tx.recentBlockhash = svm.latestBlockhash();
      tx.feePayer = bob.publicKey;
      tx.sign(bob);
      const txResult = await svm.sendTransaction(tx);

      if (txResult instanceof TransactionMetadata) {
        // console.log(txResult.logs()[1]);
      } else {
        console.log("Transaction failed:", txResult.toString());
        throw new Error("Unexpected tx failure");
    }

      // Alice donate
      const [aliceParticipationPkey, alicePaticipationBump] = getUserParticipationAddress(vaultPkey, alice.publicKey, 0, ID);

      let ixDonateAlice = await program.methods.donate(oneSol, comment).accounts(
        {
          participant: alice.publicKey,
          participation: aliceParticipationPkey,
          vault: vaultPkey,
          systemProgram: SystemProgram.programId
        }
      )
      .instruction();

      const txAlice = new Transaction().add(ixDonateAlice);
      txAlice.recentBlockhash = svm.latestBlockhash();
      txAlice.feePayer = alice.publicKey;
      txAlice.sign(alice);
      const txResultAlice = await svm.sendTransaction(txAlice);

      if (txResultAlice instanceof TransactionMetadata) {
        // console.log(txResultAlice.logs()[1]);
      } else {
        console.log("Transaction failed:", txResultAlice.toString());
        throw new Error("Unexpected tx failure");
      } 

      // Charlie donate
      const [charlieParticipationPkey, charliePaticipationBump] = getUserParticipationAddress(vaultPkey, charlie.publicKey, 1, ID);

      let ixDonateCharlie = await program.methods.donate(oneSol, comment).accounts(
        {
          participant: charlie.publicKey,
          participation: charlieParticipationPkey,
          vault: vaultPkey,
          systemProgram: SystemProgram.programId
        }
      )
      .instruction();

      const txCharlie = new Transaction().add(ixDonateCharlie);
      txCharlie.recentBlockhash = svm.latestBlockhash();
      txCharlie.feePayer = charlie.publicKey;
      txCharlie.sign(charlie);
      const txResultCharlie = await svm.sendTransaction(txCharlie);

      if (txResultCharlie instanceof TransactionMetadata) {
        // console.log(txResultCharlie.logs()[1]);
      } else {
        console.log("Transaction failed:", txResultCharlie.toString());
        throw new Error("Unexpected tx failure");
      } 

      await checkVault(
        svm, coder, program, vaultPkey, bob.publicKey, oneMonth, title, description, twoSol, tenSol, new BN(2), true, vaultBump
      )

      // Advance time beyond the funding duration
      const newClock = svm.getClock();
      newClock.unixTimestamp = BigInt(1735689600 + oneMonth.toNumber() + 10);
      svm.setClock(newClock);

      // console.log("Clock updated to:", svm.getClock().unixTimestamp.toString());

      // Withdraw funding
      let ixWithdraw = await program.methods.withdraw().accounts(
        {
          owner: charlie.publicKey,
          vault: vaultPkey,
          systemProgram: SystemProgram.programId
        }
      )
      .instruction();

      const txWithdraw = new Transaction().add(ixWithdraw);
      txWithdraw.recentBlockhash = svm.latestBlockhash();
      txWithdraw.feePayer = charlie.publicKey;
      txWithdraw.sign(charlie);
      const txResultWithdraw = await svm.sendTransaction(txWithdraw);

      if (txResultWithdraw instanceof TransactionMetadata) {
        console.log(txResultWithdraw.logs()[1]);
      } else {
        // console.log("Transaction failed:", txResultWithdraw.toString());
        expect(txResultWithdraw.toString()).to.have.string("ConstraintSeeds");
      } 
    });
  });
});

function getCSPVaultAddress(vaultCreator: PublicKey, programID: PublicKey) {

  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(CSP_VAULT),
      vaultCreator.toBuffer(),
    ], programID);
}
function getUserParticipationAddress(vault: PublicKey, participant: PublicKey, nonce: number, programID: PublicKey) {
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

async function checkVault(
  svm: LiteSVM,
  coder: BorshAccountsCoder,
  program: anchor.Program<Crowdsol>,
  vault: PublicKey,
  vaultCreator?: PublicKey,
  duration?: BN,
  title?: string,
  description?: string,
  amount?: BN,
  funds_goal?: BN,
  nonce?: BN,
  status?: boolean,
  bump?: number,
) {
  
  let data = svm.getAccount(vault).data;
  let vaultData = coder.decode("cspVault", Buffer.from(data));

  if (vaultCreator) {
    assert.strictEqual(vaultData.owner.toString(), vaultCreator.toString(), `Vault creator should be ${vaultCreator.toString()} but was ${vaultData.owner.toString()}`)
  }

  assert.notEqual(vaultData.begin, new BN(0), `Vault begin should not be 0"`);

  if (duration) {
    assert.notEqual(vaultData.duration, new BN(0), `Vault duration should not be 0`);
    assert.isAtLeast(vaultData.duration.toNumber(), MIN_DURATION.toNumber(), `Vault duration should be at least ${MIN_DURATION} seconds`);
    assert.isAtMost(vaultData.duration.toNumber(), MAX_DURATION.toNumber(), `Vault duration should be at most ${MAX_DURATION} seconds`);
  }
  if (title) {
    assert.isAtMost(vaultData.title.length, TITLE_LENGTH.toNumber(), `Vault title must have max ${COMMENT_LENGTH} length`);     
    assert.notEqual(vaultData.title.length, 0, `Vault title length for title must not be equal to 0`);     
    assert.strictEqual(vaultData.title, title, `Vault title should be "${title}" but was "${vaultData.title}"`);
  }
  if (description) {
    assert.isAtMost(vaultData.description.length, DESC_LENGTH.toNumber(), `Vault description must have max ${DESC_LENGTH} length`);     
    assert.notEqual(vaultData.description.length, 0, `Vault description length for comment must not be equal to 0`); 
    assert.strictEqual(vaultData.description, description, `Vault description should be "${description}" but was "${vaultData.description}"`);
  }
  if (amount) {
    assert.strictEqual(vaultData.amount.toNumber(), amount.toNumber(), `Vault amount should be "${amount}" but was "${vaultData.amount}"`);
  }
  if (funds_goal) {
    assert.strictEqual(vaultData.fundsGoal.toNumber(), funds_goal.toNumber(), `Vault funds_goal should be "${funds_goal}" but was "${vaultData.fundsGoal}"`);
  }
  if (nonce) {
    assert.strictEqual(vaultData.nonce.toNumber(), nonce.toNumber(), `Vault nonce should be "${nonce}" but was "${vaultData.nonce}"`);
  }
  if (status) {
    assert.strictEqual(Object.keys(vaultData.status)[0], "open", `Vault status should be open but was "${vaultData.status}"`);
  } else {
    assert.strictEqual(Object.keys(vaultData.status)[0], "withdrawn", `Vault status should be close but was "${vaultData.status}"`);
  }
  if (bump) {
    assert.strictEqual(vaultData.bump.toString(), bump.toString(), `Vault bump should be ${bump} but was ${vaultData.bump}`)
  }
}

async function checkUserParticipation(
  svm: LiteSVM,
  coder: BorshAccountsCoder,
  program: anchor.Program<Crowdsol>,
  userParticipation: PublicKey,
  user: PublicKey,
  cspVault: PublicKey,
  amount?: BN,
  comment?: string,
  vaultNonce?: BN,
  bump?: number,
) {
  let data = svm.getAccount(userParticipation).data;
  let upData = coder.decode("userParticipation", Buffer.from(data));

  if (user) {
    assert.strictEqual(upData.user.toString(), user.toString(), `User registered should be ${user.toString()} but was ${upData.user.toString()}`)
  }
  if (cspVault) {
    assert.strictEqual(upData.cspVault.toString(), cspVault.toString(), `The vault address should be ${cspVault.toString()} but was ${upData.cspVault.toString()}`)
  }

  let now = new BN(Date.now());
  assert.notEqual(upData.time, now, `User participation time should be ${now.toString()} but was ${upData.time.toString()}`);

  if (amount) {
    assert.strictEqual(upData.amount.toNumber(), amount.toNumber(), `User participation amount should be "${amount}" but was "${upData.amount}"`);
  }
  if (comment) {
    assert.isAtMost(upData.comment.length, COMMENT_LENGTH.toNumber(), `User participation comment should have be at most ${COMMENT_LENGTH} length`);        
    assert.strictEqual(upData.comment, comment, `User Participation comment should be "${comment}" but was "${upData.comment}"`);
  }
  if (vaultNonce) {
    assert.strictEqual(upData.vaultNonce.toNumber(), vaultNonce.toNumber(), `User Participation nonce should be "${vaultNonce}" but was "${vaultNonce}"`);
  }
  if (bump) {
    assert.strictEqual(upData.bump.toString(), bump.toString(), `User Participation bump should be ${bump} but was ${upData.bump}`)
  }
}