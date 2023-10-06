import { AddressZero } from "@ethersproject/constants";
import { Contract } from "@ethersproject/contracts";
import { getAddress } from "@ethersproject/address";

export function getContract(address, ABI, provider, account) {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  try {
    return new Contract(address, ABI, getProviderOrSigner(provider, account));
  } catch (error) {
    console.log(error);
  }
}

function isAddress(address) {
  try {
    return getAddress(address.toLowerCase());
  } catch {
    return false;
  }
}
function getSigner(provider, account) {
  return provider.getSigner(account).connectUnchecked();
}

function getProviderOrSigner(provider, account) {
  return account ? getSigner(provider, account) : provider;
}
