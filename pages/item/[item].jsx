import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import More_items from "./more_items";
import Meta from "../../components/Meta";
import { useDispatch } from "react-redux";
import { buyModalShow, sellModalShow } from "../../redux/counterSlice";
import Image from "next/image";

const { fetchCarouselNFTData } = require('../../data/nftDataFetcher');

const item = () => {
  const [localAddress, setLocalAddress] = useState(''); 
  const [modifiedNFTData, setModifiedNFTData] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const pid = parseInt(router.query.item);

  const [imageModal, setImageModal] = useState(false);

  useEffect(() => {
    const storedAddress = localStorage.getItem('defaultAccount');
    if (storedAddress) {
      setLocalAddress(storedAddress);
    }
    // Call the asynchronous function and set the state with the result
    fetchCarouselNFTData()
      .then((data) => setModifiedNFTData(data))
      .catch((error) => console.error('Error fetching and processing NFT data:', error.message));
  }, []);

  const selectedItem = modifiedNFTData.find(item => item.id === pid);

  return (
    <>
      <Meta title={`${pid} || LIVE DEMO | NFT Marketplace`} />
      {/*  <!-- Item --> */}
      <section className="relative lg:mt-24 lg:pt-24 lg:pb-24 mt-24 pt-12 pb-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <Image
            width={1519}
            height={773}
            priority
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full object-cover"
          />
        </picture>
        <div className="container">
          {/* Check if selectedItem exists, and if so, destructure its properties */}
          {selectedItem && (() => {
            const {
              image,
              title,
              id,
              text,
              creatorImage,
              ownerImage,
              creatorname,
              ownerName,
              royalty,
              price,
              ListedTime,
              // auction_timer,
            } = selectedItem;

            // Use the destructured properties to render the component
            return (
              <div className="md:flex md:flex-wrap" key={id}>
                {/* <!-- Image --> */}
                <figure className="mb-8 md:w-2/5 md:flex-shrink-0 md:flex-grow-0 md:basis-auto lg:w-1/2 w-full">
                  <button
                    className=" w-full"
                    onClick={() => setImageModal(true)}
                  >
                    <Image
                      width={585}
                      height={726}
                      src={image}
                      alt={title || ""}
                      className="rounded-2xl cursor-pointer h-full object-cover w-full"
                    />
                  </button>

                  {/* <!-- Modal --> */}
                  <div
                    className={
                      imageModal ? "modal fade show block" : "modal fade"
                    }
                  >
                    <div className="modal-dialog !my-0 flex h-full max-w-4xl items-center justify-center">
                      <Image
                        width={582}
                        height={722}
                        src={image}
                        alt={title || ""}
                        className="h-full object-cover w-full rounded-2xl"
                      />
                    </div>

                    <button
                      type="button"
                      className="btn-close absolute top-6 right-6"
                      onClick={() => setImageModal(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="h-6 w-6 fill-white"
                      >
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                      </svg>
                    </button>
                  </div>
                  {/* <!-- end modal --> */}
                </figure>

                {/* <!-- Details --> */}
                <div className="md:w-3/5 md:basis-auto md:pl-8 lg:w-1/2 lg:pl-[3.75rem]">
                  {/* <!-- Collection / Likes / Actions --> */}
                  <div className="mb-3 flex">
                    {/* <!-- Collection --> */}
                    <div className="flex items-center">
                      <Link
                        href="#"
                        className="text-accent mr-2 text-sm font-bold"
                      >
                        CryptoGuysNFT
                      </Link>
                      <span
                        className="dark:border-jacarta-600 bg-green inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                        data-tippy-content="Verified Collection"
                      >
                        <Tippy content={<span>Verified Collection</span>}>
                          <svg className="icon h-[.875rem] w-[.875rem] fill-white">
                            <use xlinkHref="/icons.svg#icon-right-sign"></use>
                          </svg>
                        </Tippy>
                      </span>
                    </div>
                  </div>

                  <h1 className="font-display text-jacarta-700 mb-4 text-4xl font-semibold dark:text-white">
                    {title}
                  </h1>
                  <p className="dark:text-jacarta-300 mb-10">{text}</p>

                  {/* <!-- Creator / Owner --> */}
                  <div className="mb-8 flex flex-wrap">
                    <div className="mr-8 mb-4 flex">
                      <figure className="mr-4 shrink-0">
                        <Link
                          href="/user/avatar_6"
                          className="relative block"
                        >
                          <Image
                            width={48}
                            height={48}
                            src={creatorImage}
                            alt={creatorname || ""}
                            className="rounded-2lg h-12 w-12"
                            loading="lazy"
                          />
                          <div
                            className="dark:border-jacarta-600 bg-green absolute -right-3 top-[60%] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                            data-tippy-content="Verified Collection"
                          >
                            <Tippy content={<span>Verified Collection</span>}>
                              <svg className="icon h-[.875rem] w-[.875rem] fill-white">
                                <use xlinkHref="/icons.svg#icon-right-sign"></use>
                              </svg>
                            </Tippy>
                          </div>
                        </Link>
                      </figure>
                      <div className="flex flex-col justify-center">
                        <span className="text-jacarta-400 block text-sm dark:text-white">
                          Creator <strong>{royalty}% Royalty</strong>
                        </span>
                        <Link
                          href="/user/avatar_6"
                          className="text-accent block"
                        >
                          <span className="text-sm font-bold">
                            {creatorname}
                          </span>
                        </Link>
                      </div>
                    </div>

                    <div className="mb-4 flex">
                      <figure className="mr-4 shrink-0">
                        <Link
                          href="/user/avatar_6"
                          className="relative block"
                        >
                          <Image
                            width={48}
                            height={48}
                            src={ownerImage}
                            alt={ownerName || ""}
                            className="rounded-2lg h-12 w-12"
                            loading="lazy"
                          />
                          <div
                            className="dark:border-jacarta-600 bg-green absolute -right-3 top-[60%] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                            data-tippy-content="Verified Collection"
                          >
                            <Tippy content={<span>Verified Collection</span>}>
                              <svg className="icon h-[.875rem] w-[.875rem] fill-white">
                                <use xlinkHref="/icons.svg#icon-right-sign"></use>
                              </svg>
                            </Tippy>
                          </div>
                        </Link>
                      </figure>
                      <div className="flex flex-col justify-center">
                        <span className="text-jacarta-400 block text-sm dark:text-white">
                          Owned by
                        </span>
                        <Link
                          href="/user/avatar_6"
                          className="text-accent block"
                        >
                          <span className="text-sm font-bold">
                            {`${ownerName.substring(0, 3)}...${ownerName.slice(-4)}`}
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/*Bid*/}
                  <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-8">
                    <div className="mb-8 sm:flex sm:flex-wrap">
                      {/* <!-- Highest bid --> */}
                      {/* Using if statement */}
                      {ownerName && price !== null && ownerName.toLowerCase() !== localAddress ? (
                        <div className="sm:w-1/2 sm:pr-4 lg:pr-8">
                          <div className="mt-3 flex">
                            <figure className="mr-4 shrink-0">
                              <Link href="#" className="relative block">
                                <Image
                                  width={48}
                                  height={48}
                                  src="/images/avatars/avatar_4.jpg"
                                  alt="avatar"
                                  className="rounded-2lg h-12 w-12"
                                  loading="lazy"
                                />
                              </Link>
                            </figure>
                            <div>
                              <div className="flex items-center whitespace-nowrap">
                                <Tippy content={<span>ETH</span>}>
                                  <span className="-ml-1">
                                    <svg className="icon mr-1 h-4 w-4">
                                      <use xlinkHref="/icons.svg#icon-ETH"></use>
                                    </svg>
                                  </span>
                                </Tippy>
                                <span className="text-green text-lg font-medium leading-tight tracking-tight">
                                  {price.length > 7 ? (
                                    `${price.substring(0, 5)}..${price.slice(-2)} ETH`
                                  ) : (
                                    `${price} ETH`
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                      {ownerName && price === null && ownerName.toLowerCase() !== localAddress ? (
                        <div className="sm:w-1/2 sm:pr-4 lg:pr-8">
                          <div className="mt-3 flex">
                            <figure className="mr-4 shrink-0">
                              <Link href="#" className="relative block">
                                <Image
                                  width={48}
                                  height={48}
                                  src="/images/avatars/avatar_4.jpg"
                                  alt="avatar"
                                  className="rounded-2lg h-12 w-12"
                                  loading="lazy"
                                />
                              </Link>
                            </figure>
                            <div>
                              <div className="flex items-center whitespace-nowrap">
                                <Tippy content={<span>ETH</span>}>
                                  <span className="-ml-1">
                                    <svg className="icon mr-1 h-4 w-4">
                                      <use xlinkHref="/icons.svg#icon-ETH"></use>
                                    </svg>
                                  </span>
                                </Tippy>
                                <span className="text-red text-lg font-medium leading-tight tracking-tight">
                                  Not For Sale
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {price !== null && ownerName.toLowerCase() !== localAddress ? (

                      <div>
                        {/* <!-- Countdown --> */}
                        <div className="dark:border-jacarta-600 sm:border-jacarta-100 mt-4 sm:mt-0 sm:w-1/2 pb-2">
                          <span className="js-countdown-ends-label text-jacarta-400 dark:text-jacarta-300 text-sm">
                            Listed Time
                          </span>
                          <h3>{ListedTime}</h3>
                        </div>
                        <Link href="#">
                          <button
                            className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                            onClick={() => dispatch(buyModalShow({ pid, price }))}
                          >
                            Buy
                          </button>
                        </Link>
                      </div>
                    ) : null}

                    {price === null && ownerName.toLowerCase() === localAddress ? (
                      <div>
                        <Link href="#">
                          <button
                            className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                            onClick={() => dispatch(sellModalShow({ pid }))}
                          >
                            Sell
                          </button>
                        </Link>
                      </div>
                    ) : null}

                    {price !== null && ownerName.toLowerCase() === localAddress ? (
                      <div>
                        
                        <div className="dark:border-jacarta-600 sm:border-jacarta-100 mt-4 sm:mt-0 sm:w-1/2 pb-2">
                          <span className="js-countdown-ends-label text-jacarta-400 dark:text-jacarta-300 text-sm">
                            Listed Time
                          </span>
                          <h3>{ListedTime}</h3>
                        </div>
                      </div>
                    ) : null}

                  </div>
                  {/* <!-- end bid --> */}

                </div>
                {/* <!-- end details --> */}
              </div>
            );
          })()}
        </div>
      </section>
      {/* <!-- end item --> */}

      <More_items />
    </>
  );
};

export default item;