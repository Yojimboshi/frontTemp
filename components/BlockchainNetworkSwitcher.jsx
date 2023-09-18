import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function BlockchainNetworkSwitcher() {
  const [selectedNetwork, setSelectedNetwork] = useState('mainnet');
  const [networkChange, setnetworkChange] = useState(false);
  const networks = [
    {
      id: 'mainnet',
      name: 'Mainnet',
      chainId: 1,
      rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
      blockExplorerUrl: 'https://etherscan.io/',
      symbol: 'ETH',
    },
    {
      id: 'binance',
      name: 'Binance Smart Chain',
      chainId: 56,
      rpcUrl: 'https://bsc-dataseed.binance.org/',
      blockExplorerUrl: 'https://bscscan.com/',
      symbol: 'BNB',
    },
    {
      id: 'goerli',
      name: 'Goerli',
      chainId: 5,
      rpcUrl: 'https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID',
      blockExplorerUrl: 'https://goerli.etherscan.io/',
      symbol: 'ETH',
    },
    {
      id: 'binance-testnet',
      name: 'Binance Smart Chain Testnet',
      chainId: 97,
      rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      blockExplorerUrl: 'https://testnet.bscscan.com/',
      symbol: 'BNB',
    },
  ];
  
  
  

  useEffect(() => {
    async function switchNetwork() {
      if (networkChange && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        try {
          const selectedNetworkInfo = networks.find((network) => network.id === selectedNetwork);

          if (selectedNetworkInfo) {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${selectedNetworkInfo.chainId.toString(16)}` }],
            });
          }
        } catch (error) {
          const selectedNetworkInfo = networks.find((network) => network.id === selectedNetwork);
          if (error.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  blockExplorerUrls: selectedNetworkInfo.blockExplorerUrl,
                  chainName: selectedNetworkInfo.name,
                  chainId: selectedNetworkInfo.chainId,
                }
              ]
            });

            // After adding the network, switch to it.
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${selectedNetworkInfo.chainId.toString(16)}` }],
            });
          }
        }
      }
    }

    switchNetwork();
  }, [selectedNetwork]);

  const handleNetworkChange = (event) => {
    const selectedNetworkId = event.target.value;
    setSelectedNetwork(selectedNetworkId);
    setnetworkChange(true);
  };


  return (
    <div>
      <h1>Blockchain Network Switcher</h1>
      <select className='text-jacarta-700 placeholder-jacarta-500 focus:ring-accent border-jacarta-100 w-full rounded-2xl border py-[0.6875rem] px-4 dark:border-transparent dark:bg-white/[.15] dark:text-white dark:placeholder-white' 
      value={selectedNetwork} onChange={handleNetworkChange}>
        {networks.map((network) => (
          <option
          key={network.id} value={network.id}>
            {network.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default BlockchainNetworkSwitcher;
