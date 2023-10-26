import { ethers } from 'ethers';

const txUpdateDisplay = async (transactionPromise, provider, account, updateBalance) => {
    let receipt = null;

    try {
        const txResponse = await transactionPromise;
        receipt = await txResponse.wait();
        console.log(receipt);
    } catch (error) {
        console.error("Error sending transaction:", error);
    } finally {
        try {
            // Always try to update the balance after every transaction attempt
            const newBalance = await provider.getBalance(account);
            updateBalance(ethers.utils.formatEther(newBalance));
            console.log("Updated balance:", newBalance.toString());
        } catch (balanceError) {
            console.error("Error updating balance after transaction:", balanceError);
        }
    }

    if (receipt && receipt.status === 1) {
        console.log(receipt);
        return receipt;
    } else {
        console.error("Transaction failed or not executed");
        return null;
    }
};


export default txUpdateDisplay;
