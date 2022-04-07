import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect, useState } from 'react';


export default function Home() {

  //1
  const MOVIES = [
    'https://bit.ly/3Jb3ae2',
    'https://bit.ly/3NOj69w'
  ]

  const [walletAddress, setWalletAddress] = useState(null);
  //5
  const [inputValue, setInputValue] = useState('');

  //9
  const [gifList, setGifList] = useState([]);


  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet was found!');


          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          setWalletAddress(response.publicKey.toString());
        }

      } else {
        alert('Solana object not found! Install a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  //2
  const renderConnectedContainer = () => (
    <div className="sol-connected-container">
      {/* 4 */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          //8
          sendGif();
        }}
      >
        <input type="text" placeholder="Ingresa tu película favorita"
          value={inputValue}
          onChange={onInputChange} />

        <button type="submit" className="sol-cta-button sol-submit-gif-movie-button">Enter</button>
      </form>
        {/* END 4 */}
      <div className="sol-gif-grid-movies">
        {/* 11 
        {gifList.map((gif) => (
        */}
        {MOVIES.map(gif => (
          <div className="sol-gif-movie" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  //6
  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  //7
  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue);
      //12
      setGifList([...gifList, inputValue]);
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

  //10
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
          {/* 3 */}
          {walletAddress && renderConnectedContainer()}
        </div>
      </div>
    </div>
  )
}
