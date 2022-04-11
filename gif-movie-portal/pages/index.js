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
const programID = new PublicKey(IDL.metadata.address);

const { SystemProgram, Keypair } = web3;
const network = clusterApiUrl('devnet');
const opts = {
  preflightCommitment: "processed"
}


const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new Provider(
    connection, window.solana, opts.preflightCommitment,
  );
  return provider;
}

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
          <div className="sol-gif-movie" key={gif.account.gifUrl}>
            <img src={gif.account.gifUrl} alt={gif.account.gifUrl} />
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

    //3
    getMovieList();

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

//1
  getMovieList()
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

  const getMovieList = async() => {
    try {
      const provider = getProvider();
      const program = new Program(IDL, programID, provider);
      const getAllMovies = await program.account.movieGif.all();
      console.log(getAllMovies[0].account.owner);
      setGifList(getAllMovies)
  
    } catch (error) {
      console.log("Error in getGifList: ", error)
      setGifList(null);
    }
  }


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
