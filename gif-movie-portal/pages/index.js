import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect, useState } from 'react';


export default function Home() {

  //5
  const [walletAddress, setWalletAddress] = useState(null);

  //1
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet was found!');

          //3
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );
          //6
          setWalletAddress(response.publicKey.toString());
        } //3

      } else {
        alert('Solana object not found! Install a Phantom Wallet 👻');
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
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);


  //4
  const connectWallet = async () => {

    //8
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className="sol-cta-button sol-connect-wallet-button"
      onClick={connectWallet}
    >
      Conectarse a la Wallet
    </button>
  );
  //4

  return (

    <div className="app">
      <div className="main-container">
        <div className="header-container">
          <p className="header"> 🎞️  Películas Favoritas</p>
          <p className="sub-text">
            Colección de las películas favoritas de plazinautas
          </p>
          {/*7*/}
          {!walletAddress && renderNotConnectedContainer()}
        </div>
      </div>
    </div>
  )
}
