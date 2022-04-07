import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { GifMovieSolana } from "../target/types/gif_movie_solana";

describe("gif-movie-solana", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.GifMovieSolana as Program<GifMovieSolana>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
