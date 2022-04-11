import React, { useEffect, useState } from 'react';
import {IDL} from '../public/gif_movie_solana';
import {Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';

export default function Home() {

  const MOVIES = [
    'https://bit.ly/3Jb3ae2',
    'https://bit.ly/3NOj69w'
  ]

  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const [gifList, setGifList] = useState([]);

  // 1- Get our program's id from the IDL file.
const programID = new PublicKey(IDL.metadata.address);



// 2- SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// 3- Set our network to devnet.
const network = clusterApiUrl('devnet');

// 4- Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}

//5

const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new Provider(
    connection, window.solana, opts.preflightCommitment,
  );
  return provider;
}



//6
const stringToBytes = (input) => {
  return new TextEncoder().encode(input);
};



  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet was found!');


          const response = await solana.connect({ onlyIfTrusted: true });
          var provider = getProvider();
          var program = new Program(IDL, programID, provider);
          setWalletAddress(response.publicKey.toString());
        }

      } else {
        alert('Solana object not found! Install a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderConnectedContainer = () => (
    <div className="sol-connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          sendGif();
        }}
      >
        <input type="text" placeholder="Ingresa tu película favorita"
          value={inputValue}
          onChange={onInputChange} />

        <button type="submit" className="sol-cta-button sol-submit-gif-movie-button">Enter</button>
      </form>
      <div className="sol-gif-grid-movies">
        {gifList.map(gif => (
          <div className="sol-gif-movie" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );


  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };


  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue);
    
      setGifList([...gifList, inputValue]);

      //7
      var provider = getProvider();
      var program = new Program(IDL, programID, provider);
      const [pda] = await PublicKey.findProgramAddress(
      [
        stringToBytes("gif_account"),
        provider.wallet.publicKey.toBytes(),
        stringToBytes(inputValue),
      ],
      program.programId
    );

    await program.rpc.initialize(inputValue, {
      accounts: {
        movieGif: pda,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
    });
      setInputValue('');
    } else {
      console.log('Empty input. Try again.');
    }

  };


  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching Movie list...');

      setGifList(MOVIES);
    }
  }, [walletAddress]);



  const connectWallet = async () => {


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


  return (

    <div className="app">
      <div className="main-container">
        <div className="header-container">
          <p className="header"> 🎞️ Películas Favoritas</p>
          <p className="sub-text">
            Colección de las películas favoritas de plazinautas
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
      </div>
    </div>
  )
}
