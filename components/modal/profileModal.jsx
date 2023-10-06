import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { profileModalHide } from "../../redux/counterSlice";
import { ethers } from 'ethers';
import { fetchProfileImage } from "../../data/nftDataFetcher";
import { setSelectedProfileImage } from "../../redux/counterSlice";
import { setProfileInfoCookie, getAllProfileInfoCookies } from './cookie.js';

const ProfileModal = () => {
  const { profileModal } = useSelector((state) => state.counter);
  const [NFTImage, setNFTImage] = useState([]);
  const [localAddress] = useState(localStorage.getItem('defaultAccount'));
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState("/images/avatars/avatar_1.jpg");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllProfileInfoCookies();
      const findUserData = data.find((item) => item.address === localAddress);
      if(findUserData){
        setProfileImage(findUserData.imageUrl);
      }
    };
    
    fetchProfileImage()
      .then((data) => {
        const filtered = data.filter(image => image.ownerName.toLowerCase() === localAddress);
        setNFTImage(filtered);
      })
      .catch((error) => console.error('Error fetching: ', error.message));
      fetchData();
  }, []);

  const changeProfileImage = async (imageURL) => {
    setProfileInfoCookie(localAddress, imageURL);
    dispatch(profileModalHide);
    window.location.reload();
  };

  return (
    <div>
      <div className={profileModal ? "modal fade show block" : "modal fade"}>
        <div className="modal-dialog max-w-2xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="placeBidLabel">
                Profile Picture
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => dispatch(profileModalHide())}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="fill-jacarta-700 h-6 w-6 dark:fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
                </svg>
              </button>
            </div>

            {/* <!-- Body --> */}
            <div className="modal-body p-6">
              <div className="flex justify-center">
              <figure className="relative h-40 w-40 dark:border-jacarta-600 rounded-xl border-[5px] border-white flex justify-center">
                <Image
                    width={141}
                    height={141}
                    src ={profileImage}
                    alt="Deafult Profile Image"
                    className="dark:border-jacarta-600 rounded-xl border-[5px] border-white w-full h-full object-cover"
                />
              </figure>
              </div>
            </div>
            {/* <!-- end body --> */}

            <div className="modal-footer">
              <div className="flex flex-wrap">
                {NFTImage.length > 0 ? (
                  <>
                  <div className="h-44 w-44 mr-1">
                    <Image
                      onClick={() => changeProfileImage('/images/avatars/default.jpg')}
                      width={141}
                      height={141}
                      src='/images/avatars/default.jpg'
                      alt="Default Image"
                      className="border-[5px] w-full h-full object-cover cursor-pointer"
                    />
                  </div>
                  {NFTImage.map((item, index) => (
                    <div key={index} className="h-44 w-44 mr-1">
                      <Image
                        onClick={() => changeProfileImage(item.image)}
                        width={141}
                        height={141}
                        src={item.image}
                        alt="NFT Image"
                        className="border-[5px] w-full h-full object-cover cursor-pointer"
                      />
                    </div>
                  ))}
                  </>
                ) : (
                  <span>Loading...</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;