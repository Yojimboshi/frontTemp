// cookie.js

import Cookies from 'js-cookie';
import { fetchProfileImage } from '../../data/nftDataFetcher';

// Function to set the profile information in a cookie as a delimited string
export const setProfileInfoCookie = (address, imageUrl) => {
  let slotNumber = 0;
  while (true) {
    const profileInfoInCookie = Cookies.get(`profileInfo${slotNumber}`);

    if (profileInfoInCookie === undefined) {
      const profileInfo = `${address};${imageUrl}`;
      Cookies.set(`profileInfo${slotNumber}`, profileInfo, { expires: 365 });
      break; // Exit the loop after successfully setting the cookie
    } else {
      const decodedProfileInfo = decodeURIComponent(profileInfoInCookie);
      const [cookieAddress] = decodedProfileInfo.split(';');

      if (cookieAddress === address) {
        const profileInfo = `${address};${imageUrl}`;
        Cookies.set(`profileInfo${slotNumber}`, profileInfo, { expires: 365 });
        break; // Exit the loop after successfully setting the cookie
      } else {
        slotNumber++;
      }
    }
  }
};

// Function to get all profile information from the cookie and split it
export const getAllProfileInfoCookies = async () => {
  const allProfileInfo = [];

  for (let slotNumber = 0; ; slotNumber++) {
    // Retrieve the data from the cookie
    const profileInfoCookie = Cookies.get(`profileInfo${slotNumber}`);

    if (profileInfoCookie === undefined) {
      // Exit the loop when there are no more profileInfo slots
      break;
    }

    // Decode the URL-encoded data
    const decodedData = decodeURIComponent(profileInfoCookie);

    // Split the decoded data using a semicolon
    const [address, imageUrl] = decodedData.split(';');

    // Check NFT ownership using the fetchProfileNFTData function
    const isNFTOwned = await checkOwner(address, imageUrl);

    if (isNFTOwned) {
      allProfileInfo.push({ address, imageUrl });
    } else {
      // NFT is not owned, update the image URL to the default image
      const defaultImageUrl = '/images/avatars/default.jpg';
      Cookies.set(`profileInfo${slotNumber}`, `${address};${defaultImageUrl}`, { expires: 365 });
      allProfileInfo.push({ address, imageUrl: defaultImageUrl });
    }
  }

  if (allProfileInfo.length > 0) {
    return allProfileInfo;
  } else {
    // Return the default values when there are no profileInfo slots in the cookie
    return [{ address: '', imageUrl: '/images/avatars/default.jpg' }];
  }
};

// Function to check NFT ownership
async function checkOwner(address, imageUrl) {
  // Implement the logic to check NFT ownership using the fetched NFT data
  const nftData = await fetchProfileImage();

  // Iterate through the NFT data and check if any NFT matches the provided address and imageUrl
  const isOwned = nftData.some((nft) => {
    // Compare address and imageUrl with nft.ownerName and nft.image respectively
    return nft.ownerName.toLowerCase() === address && nft.image === imageUrl;
  });

  return isOwned;
}

export const getProfileImageCookie = () => {
  const profileImage = Cookies.get('profileInfo');
  if (profileImage) {
    const [, imageUrl] = profileImage.split(';');
    return imageUrl;
  }
  return '/images/avatars/default.jpg';
};
