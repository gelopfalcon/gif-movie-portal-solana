import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { GifMovieSolana } from "../target/types/gif_movie_solana";
import { TextEncoder } from "util";
var assert = require("assert");
const { PublicKey, SystemProgram } = anchor.web3;

const stringToBytes = (input: string): Uint8Array => {
  return new TextEncoder().encode(input);
};

describe("gif-movie-solana", async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.GifMovieSolana as Program<GifMovieSolana>;

  const gif = "https//vale";

  const [pda] = await PublicKey.findProgramAddress(
    [
      stringToBytes("gif_account"),
      anchor.getProvider().wallet.publicKey.toBytes(),
      stringToBytes(gif),
    ],
    program.programId
  );

  function assertNotNull<T>(v: T | null): T {
    if (!v) throw new Error();

    return v;
  }

  it("initialize the account", async () => {
    let tx = await program.methods
      .initialize(gif)
      .accounts({
        movieGif: pda,
        user: anchor.getProvider().wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    assertNotNull(tx);
  });

  it("Get all movies", async () => {
    const gifsByOwner = await program.account.movieGif.all();

    assert.equal(1, gifsByOwner.length);
  });

  it("Finds movies by pubkey!", async () => {
    const gifsByOwner = await program.account.movieGif.all([
      {
        memcmp: {
          bytes: anchor.getProvider().wallet.publicKey.toBase58(),
          offset: 8,
        },
      },
    ]);

    assert.equal(1, gifsByOwner.length);
  });
});
