import React, { useState, useEffect } from "react";
import "tippy.js/dist/tippy.css";
import Meta from "../../components/Meta";
import Image from "next/image";
import { useWallet } from '../../context/walletContext';
import useNumberGame from '../../components/numbergame/numberGame';
import txUpdateDisplay from '../../utils/txUpdateDisplay';
import { ethers } from 'ethers';

const NumberGame = () => {
  const { account, balance } = useWallet();

  const [isWalletInitialized, setIsWalletInitialized] = useState(false);
  const [createEntryBet, setCreateEntryBet] = useState("");
  const [entryBet, setEntryBet] = useState("");
  const [guessBet, setGuessBet] = useState("");
  const [availableGames, setAvailableGames] = useState([]);
  const [selectedAvailableGames, setSelectedAvailableGames] = useState('')
  const [playerJoinedGame, setPlayerJoinedGame] = useState([]);
  const [selectedPlayerJoinedGame, setSelectedPlayerJoinedGame] = useState('');
  const [minimumBets, setminimumBets] = useState([])
  const [playerGuess, setPlayerGuess] = useState("");
  const [imageModal, setImageModal] = useState(false);

  // Only invoke useNumberGame once the wallet is initialized.
  const numberGameHooks = useNumberGame();
  const { joinGame, guess, withdraw,createGame, availableGame, availableGameBasedOnPlayerAddress, getMinimumBetFromGameId } = isWalletInitialized ? numberGameHooks : {};

  useEffect(() => {
    if (account && balance) {
      setIsWalletInitialized(true);
      console.log("Wallet Initialized");

    }
  }, [account, balance]);

  useEffect(() => {
    if (isWalletInitialized) {
      getAvailableGames();
    }
  }, [isWalletInitialized]);


  async function getAvailableGames() {
    try {
      const tempAvailableGameForPlayer = await availableGameBasedOnPlayerAddress();
      const tempAvailableGame = await availableGame();
      const tempMinimumBetBasedOnGameID = await getMinimumBetFromGameId();
      setAvailableGames(tempAvailableGame);
      setPlayerJoinedGame(tempAvailableGameForPlayer);
      setminimumBets(tempMinimumBetBasedOnGameID);
    } catch (error) {
      return;
    }

  }

  const handleJoinGame = async () => {
    if (!joinGame) {
      console.error("joinGame function is not initialized yet.");
      return;
    }
    try {

      const transactionPromise = await joinGame(entryBet, selectedAvailableGames);
      await transactionPromise.wait();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await txUpdateDisplay(transactionPromise, provider, account, updateBalance);
      // Maybe provide some success feedback here
    } catch (error) {
      console.error(error);
      // Display this error to the user
    }
  };


  const handleGuess = async () => {
    try {
      const transactionPromise = await guess(guessBet, playerGuess, selectedPlayerJoinedGame);
      await transactionPromise.wait();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await txUpdateDisplay(transactionPromise, provider, account, updateBalance);
      // Maybe provide some success feedback here
    } catch (error) {
      console.error(error);
      // Display this error to the user
    }
  };

  const handleWithdraw = async () => {
    try {

      const transactionPromise = await withdraw(selectedPlayerJoinedGame);
      await transactionPromise.wait();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await txUpdateDisplay(transactionPromise, provider, account, updateBalance);
      // Maybe provide some success feedback here
    } catch (error) {
      console.error(error);
      // Display this error to the user
    }
  };

  const handleCreateGame = async () => {
    if (!createGame) {
      console.error("createGame function is not initialized yet.");
      return;
    }
    try {

      const transactionPromise = await createGame(createEntryBet);
      await transactionPromise.wait();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await txUpdateDisplay(transactionPromise, provider, account, updateBalance);
      // Maybe provide some success feedback here
    } catch (error) {
      console.error(error);
      // Display this error to the user
    }
  };

  {/*<---- Interface Handler ----> */ }

  const handleAvailbleGamesOption = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue !== '' && !availableGames.includes(selectedValue)) {
      setSelectedAvailableGames(selectedValue);
    } else {
      setSelectedAvailableGames('');
    }
  };

  const handlePlayerJoinedGameOption = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue !== '' && !playerJoinedGame.includes(selectedValue)) {
      setSelectedPlayerJoinedGame(selectedValue);
    } else {
      setSelectedPlayerJoinedGame('');
    }
  };

  

  return (
    <>
      <Meta title={`Number Game || DEMO`} />
      <section className="relative lg:pb-24 pb-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <Image
            width={1518}
            height={773}
            priority
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full object-cover"
          />
        </picture>
        <div className="container">
          <div className="text-left mt-6">
            <h1>Current Game Id: {selectedPlayerJoinedGame}</h1>
          </div>
          <div className="text-center mt-6">
            <h1 className="text-3xl font-semibold mb-5">Welcome to the Number Game</h1>
          </div>
          <div className="grid grid-cols-2 gap-4 items-center">
              <button
                className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block rounded-full py-2 px-4 w-1/2 ml-auto text-center font-semibold text-white transition-all m-2"
                disabled={!isWalletInitialized}
                onClick={handleCreateGame}
              >Create Game
              </button>
              <div style={{ width: '50%' }}>
                <input
                  value={createEntryBet}
                  onChange={(e) => setCreateEntryBet(e.target.value)}
                  className="border border-solid dark:border-jacarta-600 border-gray-300 mb-2 rounded-full py-2 px-4 w-full m-2"
                  placeholder="Enter your Entry Bet here"
                />
              </div>
            </div>
          {selectedAvailableGames &&
            <div className="grid grid-cols-2 gap-4 items-center">
              <button
                className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block rounded-full py-2 px-4 w-1/2 ml-auto text-center font-semibold text-white transition-all m-2"
                disabled={!isWalletInitialized}
                onClick={handleJoinGame}
              >Join Game
              </button>
              <h1>Default Bet Min =</h1>
              <div style={{ width: '50%' }}>
                <input
                  value={entryBet}
                  onChange={(e) => setEntryBet(e.target.value)}
                  className="border border-solid dark:border-jacarta-600 border-gray-300 mb-2 rounded-full py-2 px-4 w-full m-2"
                  placeholder="Enter your Entry Bet here"
                />
              </div>
            </div>
          }
          <div class="flex justify-center items-center">
            <div class="flex justify-center items-center">
              <div class="m-2">
                <h1 class="mb-2">Available Games to join</h1>
                <select className='text-jacarta-700 placeholder-jacarta-500 focus:ring-accent border-jacarta-100 w-60 rounded-2xl border py-[0.6875rem] px-4 dark:border-transparent dark:bg-white/[.15] dark:text-white dark:placeholder-white' 
                  onChange={handleAvailbleGamesOption}>
                  <option disabled selected value="">Available Games to join</option>
                  {availableGames.map((number, index) => (
                    <option key={index} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div class="flex justify-center items-center">
              <div class="m-2">
                <h1 class="mb-2">Games that you have joined</h1>
                <select className='text-jacarta-700 placeholder-jacarta-500 focus:ring-accent border-jacarta-100 w-60 rounded-2xl border py-[0.6875rem] px-4 dark:border-transparent dark:bg-white/[.15] dark:text-white dark:placeholder-white' 
                  onChange={handlePlayerJoinedGameOption}>
                  <option disabled selected value="">GamesIds that you joined</option>
                  {playerJoinedGame.map((number, index) => (
                    <option key={index} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {selectedPlayerJoinedGame &&
            <div>
              <div className="md:flex md:flex-wrap">
                <figure className="mb-8 md:w-2/5 md:flex-shrink-0 md:flex-grow-0 md:basis-auto lg:w-1/2 w-full">
                  <button className="w-full" onClick={() => setImageModal(true)}>
                    <Image width={585} height={726} src="/images/custom/numberGame.png" alt="Your Image Description" className="rounded-2xl cursor-pointer h-full object-cover w-full" />
                  </button>
                </figure>
                <div className="md:w-3/5 md:basis-auto lg:w-1/5">
                  <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-12">
                    <p className="mb-3 font-semibold">Display Guessed number</p>
                    <p className="mb-3 font-semibold">Display number of bets</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-between">
                <div className="flex justify-between w-full">
                  <input
                    value={guessBet}
                    onChange={(e) => setGuessBet(e.target.value)}
                    className="w-1/4 border border-solid dark:border-jacarta-600 border-gray-300 mb-3 rounded-full py-3 px-8 w-full m-3"
                    placeholder="Enter your Bet here"
                  />
                  <input
                    value={playerGuess}
                    onChange={(e) => setPlayerGuess(e.target.value)}
                    className="border border-solid dark:border-jacarta-600 border-gray-300 mb-3 rounded-full py-3 px-8 w-full m-3"
                    placeholder="Enter your Guess here"
                  />
                </div>
                <button
                  className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block rounded-full py-3 px-8 text-center font-semibold text-white transition-all m-3"
                  onClick={handleGuess}
                >Guess</button>
                <button
                  className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block rounded-full py-3 px-8 text-center font-semibold text-white transition-all m-3"
                  onClick={handleWithdraw}
                >Withdraw</button>
              </div>
            </div>
          }

        </div>
      </section>
    </>
  );
};

export default NumberGame;