import "../styles/globals.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

function MyApp({ Component, pageProps }) {
  //5
  const [walletAddress, setWalletAddress] = useState(null);

  //1
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet was found!");

          //3
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Connected with Public Key:",
            response.publicKey.toString()
          );
          //6
          setWalletAddress(response.publicKey.toString());
        } //3
      } else {
        alert("Solana object not found! Install a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  //2
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  //4
  const connectWallet = async () => {
    //8
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  return (
    <div>
      {!walletAddress && (
        <div className={styles.container}>
          <button
            className={styles.sol_connect_wallet_button}
            onClick={connectWallet}
          >
            Conectarse
          </button>
        </div>
      )}
      <div>
        <main>
          <nav className="border-b p-6">
            <p className="text-4xl font-bold">Platzi Movies</p>
            <div className="flex mt-4">
              <Link href="/">
                <a className="mr-4 link-menu">Inicio</a>
              </Link>
              <Link href="/add-movie">
                <a className="mr-6 link-menu">Agregar Películas</a>
              </Link>
              <Link href="/my-movies">
                <a className="mr-6 link-menu">Mis Películas</a>
              </Link>
            </div>
          </nav>
        </main>
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
