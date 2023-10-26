import React, { useState, useEffect } from "react";
import "tippy.js/dist/tippy.css";
import Meta from "../../components/Meta";
import Image from "next/image";
import { useWallet } from '../../context/walletContext';
import useNumberofRisk from '../../components/numbergame/CardGameOfRisks';
import txUpdateDisplay from '../../utils/txUpdateDisplay';
import { ethers } from 'ethers';
import Card from '../../components/numbergame/card';
const NumberGame2 = () => {
  const { account, balance } = useWallet();
  const [isWalletInitialized, setIsWalletInitialized] = useState(false);
  const [openReward, setOpenReward] = useState(false);
  const [createEntryBet, setCreateEntryBet] = useState("");
  const [createdGame, setCreatedGame] = useState(false);
  const [playerJoinedGame, setPlayerJoinedGame] = useState([]);
  const [selectedPlayerJoinedGame, setSelectedPlayerJoinedGame] = useState('');
  const [cardsData, setCardsData] = useState([
    { front: '/images/custom/card.jpg', back: 'Content for Card 1' },
    { front: '/images/custom/card.jpg', back: 'Content for Card 2' },
    { front: '/images/custom/card.jpg', back: 'Content for Card 3' },
  ]);
  // Only invoke useNumberGame once the wallet is initialized.
  const numberGameHooks = useNumberofRisk();
  const { withdraw, createGame, availableGameBasedOnPlayerAddress } = isWalletInitialized ? numberGameHooks : {};

  useEffect(() => {
    if (account && balance) {
      setIsWalletInitialized(true);
    }
  }, [account, balance]);

  useEffect(() => {
    if (isWalletInitialized) {
      getAvailableGames();
      setCreatedGame(false);
    }
  }, [isWalletInitialized, createdGame]);


  async function getAvailableGames() {
    try {
      const tempAvailableGameForPlayer = await availableGameBasedOnPlayerAddress();
      setPlayerJoinedGame(tempAvailableGameForPlayer);
    } catch (error) {
      return;
    }
  }


  const handleWithdraw = async () => {
    try {
      const transactionPromise = await withdraw(selectedPlayerJoinedGame);
      await transactionPromise.wait();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await txUpdateDisplay(transactionPromise, provider, account);
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
      setCreatedGame(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await txUpdateDisplay(transactionPromise, provider, account);
      // Maybe provide some success feedback here
    } catch (error) {
      console.error(error);
      // Display this error to the user
    }
  };

  {/*<---- Interface Handler ----> */ }

  const handlePlayerJoinedGameOption = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue !== '' && !playerJoinedGame.includes(selectedValue)) {
      setSelectedPlayerJoinedGame(selectedValue);
    } else {
      setSelectedPlayerJoinedGame('');
    }
  };

  const handleOpenReward = () => {
    setOpenReward(!openReward);
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
            <h1 className="text-3xl font-semibold mb-5">Welcome to Number of Risk</h1>
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

          <div className="flex flex-wrap justify-between">
            <button
              className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block rounded-full py-3 px-8 text-center font-semibold text-white transition-all m-3"
              disabled={!isWalletInitialized}
              onClick={handleOpenReward}
            >See Reward
            </button>
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

          {openReward &&
            <div className="flex flex-col items-start">
              <div className="grid grid-cols-2 dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white">

                <div className="p-4">Rounds</div>
                <div className="p-4">Chances to win</div>
                <div className=" p-4">Round 1</div>
                <div className=" p-4 whitespace-pre-line">
                  Chance to win up to x3
                </div>
                <div className=" p-4">Round 2</div>
                <div className="p-4 whitespace-pre-line">
                  Chance to win up to x6
                </div>
                <div className="p-4">Round 3</div>
                <div className="p-4 whitespace-pre-line">
                  Chance to win up to x10
                </div>

              </div>
            </div>
          }
          {selectedPlayerJoinedGame &&
            <div className="items-center ">
              <h1 className="text-center text-3xl font-semibold mb-5">Select a Card to play the game</h1>
              <div className="flex justify-between">
                {cardsData.map((card, index) => (
                  <div key={index} className="w-1/3 p-2">
                    <Card
                      key={index}
                      front={<img src={card.front} alt={`Card ${index + 1}`} style={{ width: '100%', height: '100%' }} />}
                      back={card.back}
                      cardIndex={index}
                      selectedPlayerJoinedGame={selectedPlayerJoinedGame}
                      cardsData={cardsData}
                      settingCardsData={setCardsData}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center">
                <button
                  className=" bg-accent shadow-accent-volume hover:bg-accent-dark inline-block rounded-full py-3 px-8 text-center font-semibold text-white transition-all m-3"
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

export default NumberGame2;