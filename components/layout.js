import Footer from "./footer";
import Wallet_modal from "./modal/wallet_modal";
import BuyModal from "./modal/buyModal";
import SellModal from "./modal/onSellNFT";
import ProfileModal from "./modal/profileModal";
import { useRouter } from "next/router";
import Header01 from "./header/Header01";
import Header02 from "./header/Header02";
import Header03 from "./header/Header03";
import Header04 from "./header/Header04";
import { useSelector } from 'react-redux';

export default function Layout({ children }) {
  const route = useRouter();
  console.log("layout render...");
  const profileModal = useSelector((state) => state.counter.profileModal);
  const sellModal = useSelector((state) => state.counter.sellModal);
  const buyModal = useSelector((state) => state.counter.buyModal);
  // header start
  let header;
  if (
    route.asPath === "/home/home_3" ||
    route.asPath === "/home/home_9" ||
    route.asPath === "/maintenance" ||
    route.asPath === "/home/home_12"
  ) {
    header = <Header02 />;
  } else if (route.asPath === "/platform_status") {
    header = <Header03 />;
  } else if (route.asPath === "/home/number_game") {
    header = <Header01 />;
  } else {
    header = <Header01 />;
  }
  // header end

  return (
    <>
      {header}
      <Wallet_modal />
      <Wallet_modal />
      {sellModal && <SellModal />}
      {buyModal && <BuyModal />}
      {profileModal && <ProfileModal />}
      <main>{children}</main>
      <Footer />
    </>
  );
}
