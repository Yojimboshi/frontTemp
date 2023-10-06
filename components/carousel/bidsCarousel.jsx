import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import "tippy.js/dist/tippy.css";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { buyModalShow } from "../../redux/counterSlice";
import { useDispatch } from "react-redux";
import Likes from "../likes";
const { fetchCarouselNFTData } = require('../../data/nftDataFetcher');

const BidsCarousel = () => {
  const [localAddress, setLocalAddress] = useState('');
  const [modifiedNFTData, setModifiedNFTData] = useState([]);
  const dispatch = useDispatch();
  const handleclick = () => {
    console.log("clicked on ");
  };

  useEffect(() => {
    const storeAddress = localStorage.getItem('defaultAccount');
    if(storeAddress){
      setLocalAddress(storeAddress);
    }
    // Call the asynchronous function and set the state with the result
    fetchCarouselNFTData()
      .then((data) => setModifiedNFTData(data))
      .catch((error) => console.error('Error fetching and processing NFT data:', error.message));
  }, []);

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar]}
        spaceBetween={30}
        slidesPerView="auto"
        loop={true}
        breakpoints={{
          240: {
            slidesPerView: 1,
          },
          565: {
            slidesPerView: 2,
          },
          1000: {
            slidesPerView: 3,
          },
          1100: {
            slidesPerView: 4,
          },
        }}
        navigation={{
          nextEl: ".bids-swiper-button-next",
          prevEl: ".bids-swiper-button-prev",
        }}
        className=" card-slider-4-columns !py-5"
      >
        {modifiedNFTData.map((item) => {
          const { id, image, title, ListedTime, price, ownerName } =
            item;
          const pid = id;

          return (
            <SwiperSlide className="text-white" key={id}>
              <article>
                <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg text-jacarta-500">
                  <figure>
                    {/* {`item/${itemLink}`} */}
                    <Link href={"/item/" + pid}>
                      <Image
                        src={image}
                        alt={title}
                        height={230}
                        width={230}
                        className="rounded-[0.625rem] w-full lg:h-[230px] object-cover"
                        loading="lazy"
                      />
                    </Link>
                  </figure>
                  <div className="mt-4 flex items-center justify-between">
                    <Link href={"/item/" + pid}>
                      <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                        {title}
                      </span>
                    </Link>
                    <span className="dark:border-jacarta-600 border-jacarta-100 flex items-center whitespace-nowrap rounded-md border py-1 px-2">
                      <Tippy content={<span>ETH</span>}>
                        <Image
                          width={12}
                          height={12}
                          src="/images/eth-icon.svg"
                          alt="icon"
                          className="w-3 h-3 mr-1"
                        />
                      </Tippy>
                      {price !== null ? (
                        <span className="text-green text-sm font-medium tracking-tight">
                          {price.length > 7 ? (
                            `${price.substring(0, 5)}..${price.slice(-2)} ETH`
                          ) : (
                            `${price} ETH`
                          )}
                        </span>
                      ) : (
                        <span className="text-green text-sm font-medium tracking-tight">
                          Not For Sale
                        </span>
                      )}
                    </span>
                  </div>

                  {ownerName.toLowerCase() === localAddress && price !== null ? (
                    <div className="mt-8 flex items-center justify-between">
                      {/* <h1>Owned</h1> */}
                      <h1>{`${ListedTime}`}</h1>
                    </div>
                  ):null}
                  {ownerName.toLowerCase() === localAddress && price === null ? (
                    <div className="mt-8 flex items-center justify-between">
                      <h1>Owned</h1>
                    </div>
                  ): null}
                  {ownerName.toLowerCase() !== localAddress && price === null ? (
                    <div className="mt-8 flex items-center justify-between">
                      <h1>Not For Sale</h1>
                    </div>
                  ): null}
                  {ownerName.toLowerCase() !== localAddress && price !== null ? (
                    <div className="mt-8 flex items-center justify-between">
                    <button
                      type="button"
                      className="text-accent font-display text-sm font-semibold"
                      onClick={() => dispatch(buyModalShow({ pid, price }))}
                    >
                      Buy
                    </button>
                    </div>
                  ): null}
                </div>
              </article>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* <!-- Slider Navigation --> */}
      <div className="group bids-swiper-button-prev swiper-button-prev shadow-white-volume absolute !top-1/2 !-left-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-left-6 after:hidden">
        <MdKeyboardArrowLeft />
      </div>
      <div className="group bids-swiper-button-next swiper-button-next shadow-white-volume absolute !top-1/2 !-right-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-right-6 after:hidden">
        <MdKeyboardArrowRight />
      </div>
    </>
  );
};

export default BidsCarousel;
