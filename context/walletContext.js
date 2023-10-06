import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const useWallet = () => {
  return useContext(WalletContext);
};

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  const updateAccount = (newAccount) => {
    localStorage.setItem('defaultAccount', newAccount);
    setAccount(newAccount);
  };

  const updateBalance = async () => {
    if(!account) return;  // No account, just return
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const newBalance = await provider.getBalance(account);
    const formattedBalance = ethers.utils.formatEther(newBalance);

    localStorage.setItem('accountBalance', formattedBalance);
    setBalance(formattedBalance);
};


  const value = {
    account,
    updateAccount,
    balance,
    updateBalance,
  };

  useEffect(() => {
    // Load values from localStorage
    const storedAccount = localStorage.getItem('defaultAccount');
    if (storedAccount) {
      setAccount(storedAccount);
    }

    const storedBalance = localStorage.getItem('accountBalance');
    if (storedBalance) {
      setBalance(storedBalance);
    }

    // Listen to MetaMask account changes
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
          updateAccount(accounts[0]);
          await updateBalance(accounts[0]); // fetch and update balance for the new account
        }
        console.log('Account changed:', accounts[0]);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      // Cleanup listener on component unmount
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [updateAccount]);

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
