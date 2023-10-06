import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Likes from "../likes";
import Auctions_dropdown from "../dropdown/Auctions_dropdown";
import { useDispatch, useSelector } from "react-redux";
import { buyModalShow } from "../../redux/counterSlice";
const { fetchProfileNFTData } = require('../../data/nftDataFetcher');

const OnSaleNFT = () => {
  const [userNFTs, setUserNFTs] = useState([]);
  const [localAddress, setLocalAddress] = useState('');
  const [filteredNFTs, setFilteredNFTs] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedAddress = localStorage.getItem('defaultAccount');

    if (storedAddress) {
      setLocalAddress(storedAddress);
    }
  },[]);

  useEffect(() => {
    // Fetch data only once when the component mounts
    fetchProfileNFTData()
      .then((data) => {
        setUserNFTs(data); // Set the fetched data in the state
      })
      .catch((error) => console.error('Error fetching and processing NFT data:', error.message));
  },[]);

  useEffect(() => {
    const filteredData = userNFTs.filter((nft) => {
      // Check if ownerName matches localAddress and price is not null
      return nft.ownerName.toLowerCase() === localAddress && nft.price !== null;
    });
    setFilteredNFTs(filteredData);
  }, [userNFTs, localAddress]); // Trigger the filter when userNFTs or localAddress change
  

  return (
    <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
      {filteredNFTs.map((item) => {
        const {
          id,
          image,
          title,
          price,
          likes,
          creator,
          owner,
        } = item;
        
        const itemLink = image
          .split("/")
          .slice(-1)
          .toString()
          .replace(".jpg", "")
          .replace(".gif", "");
        return (
          <article key={id}>
            <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
              <figure className="relative">
                <Link href={`/item/${id}`}>
                  <Image
                    width={230}
                    height={230}
                    src={image}
                    alt="item 5"
                    className="w-full h-[230px] rounded-[0.625rem] object-cover"
                  />
                </Link>

                <Likes like={likes} />

                <div className="absolute left-3 -bottom-3">
                  <div className="flex -space-x-2">
                    <Link href={`/item/${itemLink}`}>
                      <Tippy content={<span>creator: {creator.name}</span>}>
                        <Image
                          width={21}
                          height={21}
                          src={creator.image}
                          alt="creator"
                          className="dark:border-jacarta-600 hover:border-accent dark:hover:border-accent h-6 w-6 rounded-full border-2 border-white"
                        />
                      </Tippy>
                    </Link>
                    <Link href={`/item/${itemLink}`}>
                      <Tippy content={<span>creator: {owner.name}</span>}>
                        <Image
                          width={21}
                          height={21}
                          src={owner.image}
                          alt="owner"
                          className="dark:border-jacarta-600 hover:border-accent dark:hover:border-accent h-6 w-6 rounded-full border-2 border-white"
                        />
                      </Tippy>
                    </Link>
                  </div>
                </div>
              </figure>
              <div className="mt-7 flex items-center justify-between">
                <Link href={`/item/${itemLink}`}>
                  <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                    {title}
                  </span>
                </Link>

                {/* auction dropdown  */}
                <Auctions_dropdown classes="dark:hover:bg-jacarta-600 dropup hover:bg-jacarta-100 rounded-full " />
              </div>
              <div className="mt-2 text-sm">
                {price !== null ?(
                  <span className="dark:text-jacarta-200 text-jacarta-700 mr-1">
                  {price.length > 7 ? (
                    `${price.substring(0, 5)}..${price.slice(-2)} ETH`
                  ) : (
                    `${price} ETH`
                  )}
                  </span>
                ):null}
              </div>

            </div>
          </article>
        );
      })}
    </div>
  );
};

export default OnSaleNFT;