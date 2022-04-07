import React, { useEffect, useState } from 'react';


export default function Home() {

  const MOVIES = [
    'https://bit.ly/3Jb3ae2',
    'https://bit.ly/3NOj69w'
  ]

  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');

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
