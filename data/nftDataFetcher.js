import { ethers, providers } from 'ethers';
import axios from 'axios';
import { nftContractAddress, providerURL } from '../config/setting';
import contractAbi from './abi/nftMintAbi.json';
require('dotenv').config();

const provider = new providers.JsonRpcProvider(providerURL);

async function getAllNFTData() {
  const nftData = [];
  const nftContract = new ethers.Contract(nftContractAddress, contractAbi, provider);
  const totalIndex = await nftContract.totalSupply();
  const promises = [];
  for (let index = 0; index < totalIndex; index++) {
    promises.push(getNFTData(nftContract, index));
  }
  

  const results = await Promise.all(promises);

  results.forEach((result) => {
    nftData.push({ 
      owner: result.tokenOwner, 
      nftUri: result.tokenURI,
      royaltyPercentage: result.royaltyPercentage,
      nftPrice: result.price,
      nftListedTime: result.NFTListedTime  ,
    });
  });
  return nftData;
}

async function getNFTData(nftContract, index) {
  const tokenURI = await nftContract.tokenURI(index);
  const tokenOwner = await nftContract.ownerOf(index);
  const listing = await nftContract.nftListings(index);
  const royaltyPercentage = await nftContract.royaltyPercentage();

  const isForSale = listing[2]; // Check if the NFT is for sale
  const listingTimestamp = listing[3]; // Get the listing timestamp

  let price = null;
  if (isForSale) {
    price = ethers.utils.formatEther(listing[1]); // Get the price if the NFT is for sale
  }

  const timestamp = listingTimestamp;
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds

  var today = new Date();
  var timeDifference = today.getTime() - date.getTime(); // Calculate the time difference in milliseconds

  // Convert time difference to hours, minutes, and seconds
  var hours = Math.floor(timeDifference / 3600000);
  var minutes = Math.floor((timeDifference % 3600000) / 60000);
  var seconds = Math.floor((timeDifference % 60000) / 1000);

  let NFTListedTime = hours + "h " + minutes + "m " + seconds + "s";

  const nftData = {
    tokenOwner,
    tokenURI,
    royaltyPercentage,
    isForSale,
    price,
    NFTListedTime, // Include the listing timestamp in the data
  };

  return nftData;
}

async function getNFTDataFromIPFS() {
  let nftDatas = await getAllNFTData();

  for (const data of nftDatas) {
    const uriData = data.nftUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
    const ownerAdd = data.owner;
    const royalty = data.royaltyPercentage.toNumber();

    try {
      const response = await axios.get(uriData);
      data.uriData = response.data;
      data.ownerName = ownerAdd;
      data.percentage = royalty;
    } catch (error) {
      console.error(`Error fetching data for ${data.nftUri}:`, error.message);
    }
  }

  return nftDatas;
}

function mapDataToCarouselFormat(nftDataArray) {
  return nftDataArray.map((item, index) => {
    return {
      id: index,
      description: item.uriData.description,
      image: item.uriData.image,
      name: item.uriData.name,
      ownerName: item.ownerName,
      royalty: item.percentage,
      price: item.nftPrice,
      ListedTime: item.nftListedTime,
      title: 'Lorem Ipsum',
      like: 160,
      creatorImage: item.uriData.image,
      ownerImage: item.uriData.image,
      creatorName: 'hello',
      auction_timer: '636234213',
      text: 'Lorum',
      // Add any other properties you need
    };
  });
}

function mapDataToCollectionFormat(nftDataArray) {
  return nftDataArray.map((item, index) => {
    return {
      ownerName: item.ownerName,
      image: item.uriData.image,
      id: index,
      category: "art", // you may need to adjust or derive this
      title: 'Lorem Ipsum',
      nfsw: false, // you may need to adjust or derive this
      lazyMinted: true, // you may need to adjust or derive this
      verified: true, // you may need to adjust or derive this
      addDate: `date #${index}`, // you may need to adjust or derive this
      sortPrice: 5.9, // you may need to adjust or derive this
      price: item.nftPrice,
      bidLimit: 7, // you may need to adjust or derive this
      bidCount: 1, // you may need to adjust or derive this
      likes: 188, // you may need to adjust or derive this
      creator: {
        name: `hello`, // you may need to adjust or derive this
        image: item.uriData.image, // adjust as needed
      },
      owner: {
        name: `test`, // you may need to adjust or derive this
        image: item.uriData.image, // adjust as needed
      },
    };
  });
}

function mapToFeatureCollectionsFormat(nftDataArray) {
  return nftDataArray.map((item, index) => {
    return 	{
      id: index,
      bigImage: item.uriData.image,
      subImage1: item.uriData.image,
      subImage2: item.uriData.image,
      subImage3: item.uriData.image,
      userImage: item.uriData.image,
      userName: `user #${index}`,
      itemsCount: `${100+index}`,
      title: item.uriData.name,
      category: 'art',
      category: 'Collectibles',
      category: 'photography',
      top: true,
      trending: true,
      recent: true,
      price: item.nftPrice,
    }
  });
}

function categoriesData(nftDataArray){
  return nftDataArray.map((item, index) => {
    return {
      ownerName: item.ownerName,
        image: item.uriData.image,
        id: "Amazing NFT art1",
        category: "Collectibles",
        title: "Amazing NFT art",
        nfsw: true,
        lazyMinted: false,
        verified: false,
        addDate: 2,
        sortPrice: 5.9,
        price: item.nftPrice,
        bidLimit: 7,
        bidCount: 1,
        likes: 188,
        creator: {
          name: "Sussygirl",
          image: item.uriData.image,
        },
        owner: {
          name: "Sussygirl",
          image: item.uriData.image,
        },
    }
  });
}

function mapDataForProfile(nftDataArray) {
  return nftDataArray.map((item, index) => {
    return {
      ownerName: item.ownerName,
      image: item.uriData.image,
      id: index,
      price: item.nftPrice,
      likes: 188, // you may need to adjust or derive this
      creator: {
        name: `hello`, // you may need to adjust or derive this
        image: item.uriData.image, // adjust as needed
      },
      owner: {
        name: `test`, // you may need to adjust or derive this
        image: item.uriData.image, // adjust as needed
      },
    };
  });
}

function mapDataForProfilePicture(nftDataArray) {
  return nftDataArray.map((item) => {
    return {
      image: item.uriData.image,
      ownerName: item.ownerName,
    };
  });
}

async function fetchCarouselNFTData() {
  try {
    const nftDataWithUriData = await getNFTDataFromIPFS();
    const modifiedNftDatas = mapDataToCarouselFormat(nftDataWithUriData);
    return modifiedNftDatas;
  } catch (error) {
    console.error('Error fetching NFT data:', error.message);
  }
}

async function fetchCollectionNFTData() {
  try {
    const nftContract = new ethers.Contract(nftContractAddress, contractAbi, provider);
    const nftDataWithUriData = await getNFTDataFromIPFS();
    const modifiedNftDatas = mapDataToCollectionFormat(nftDataWithUriData);
    return modifiedNftDatas;
  } catch (error) {
    console.error('Error fetching NFT data:', error.message);
  }
}

async function fetchExploreCollectionNFTData() {
  try {
    const nftDataWithUriData = await getNFTDataFromIPFS();
    const modifiedNftDatas = mapToFeatureCollectionsFormat(nftDataWithUriData);
    return modifiedNftDatas;
  } catch (error) {
    console.error('Error fetching NFT data:', error.message);
  }
}

async function fetchCategoriesNFTData(){
  try{
    const nftDataWithUriData = await getNFTDataFromIPFS();
    const modifiedNftDatas = categoriesData(nftDataWithUriData);
    return modifiedNftDatas;
  }catch(error){
    console.error('Error fetching categories data: ', error.message);
  }
}

async function fetchProfileNFTData() {
  try {
    const nftContract = new ethers.Contract(nftContractAddress, contractAbi, provider);
    const nftDataWithUriData = await getNFTDataFromIPFS();
    const modifiedNftDatas = mapDataForProfile(nftDataWithUriData);
    return modifiedNftDatas;
  } catch (error) {
    console.error('Error fetching NFT data:', error.message);
  }
}

async function fetchProfileImage() {
  try {
    const nftContract = new ethers.Contract(nftContractAddress, contractAbi, provider);
    const nftDataWithUriData = await getNFTDataFromIPFS();
    const modifiedNftDatas = mapDataForProfilePicture(nftDataWithUriData);
    return modifiedNftDatas;
  } catch (error) {
    console.error('Error fetching NFT data:', error.message);
  }
}

export { fetchCarouselNFTData, fetchCollectionNFTData ,fetchExploreCollectionNFTData, fetchCategoriesNFTData, fetchProfileNFTData, fetchProfileImage };
