let provider;
let signer;
let contract;

const contractAddress = '0xedD74659AFE00Ce1ffdc7Ccc0A338bfc0e084181'; // Remplacez par l'adresse de votre contrat
const contractABI = [{"inputs":[{"internalType":"address","name":"_bankroll","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AlreadyClaimed","type":"error"},{"inputs":[],"name":"GameEnded","type":"error"},{"inputs":[],"name":"InvalidAmount","type":"error"},{"inputs":[{"internalType":"uint256","name":"required","type":"uint256"},{"internalType":"uint256","name":"sent","type":"uint256"}],"name":"InvalidValue","type":"error"},{"inputs":[],"name":"NoReward","type":"error"},{"inputs":[{"internalType":"uint256","name":"want","type":"uint256"},{"internalType":"uint256","name":"have","type":"uint256"}],"name":"NotEnded","type":"error"},{"inputs":[{"internalType":"uint256","name":"want","type":"uint256"},{"internalType":"uint256","name":"have","type":"uint256"}],"name":"NotStarted","type":"error"},{"inputs":[{"internalType":"address","name":"want","type":"address"},{"internalType":"address","name":"have","type":"address"}],"name":"NotWinner","type":"error"},{"inputs":[],"name":"RefundFailed","type":"error"},{"inputs":[],"name":"TransferFailed","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"GrandPrizeClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PrizeClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RebateClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"endTime","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"pricePaid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"numKeysBefore","type":"uint256"}],"name":"keyPurchased","type":"event"},{"inputs":[{"internalType":"address","name":"player","type":"address"}],"name":"amountToClaim","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"amountsClaimed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimGrandPrize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimPrize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"endTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ethValue","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"player","type":"address"}],"name":"getState","outputs":[{"internalType":"uint256","name":"_startTime","type":"uint256"},{"internalType":"uint256","name":"_endTime","type":"uint256"},{"internalType":"address","name":"_leader","type":"address"},{"internalType":"uint256","name":"_potSize","type":"uint256"},{"internalType":"uint256","name":"_totalKeysPurchased","type":"uint256"},{"internalType":"uint256","name":"_currentTicketPrice","type":"uint256"},{"internalType":"uint256","name":"_totalETHReceived","type":"uint256"},{"internalType":"uint256","name":"_numberKeysPurchased","type":"uint256"},{"internalType":"uint256","name":"_rewardAvailableToClaim","type":"uint256"},{"internalType":"bool","name":"_grandPrizeClaimed","type":"bool"},{"internalType":"bool","name":"_prizeClaimed","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"grandPrizeClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastBuyer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"numberOfKeysPurchased","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"potSize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"prizeClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"purchaseKeys","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"startTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ticketsShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalETHReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalKeysPurchased","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"transferToBankroll","outputs":[],"stateMutability":"nonpayable","type":"function"}]; // Remplacez par votre ABI

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);

        document.getElementById("connectWallet").style.display = "none";
        document.getElementById("gameInfo").style.display = "block";
        document.getElementById("actions").style.display = "block";

        updateGameInfo();
    } else {
        alert("MetaMask not detected!");
    }
}

async function updateGameInfo() {
    const startTime = await contract.startTime();
    const endTime = await contract.endTime();
    const lastBuyer = await contract.lastBuyer();
    const potSize = await contract.potSize();
    const totalKeysPurchased = await contract.totalKeysPurchased();
    const currentTicketPrice = await contract.ethValue(totalKeysPurchased.add(1));
    const totalETHReceived = await contract.totalETHReceived();
    const yourKeys = await contract.numberOfKeysPurchased(await signer.getAddress());
    const rewardAvailable = await contract.amountToClaim(await signer.getAddress());
    const grandPrizeClaimed = await contract.grandPrizeClaimed();

    document.getElementById("startTime").innerText = new Date(startTime * 1000).toLocaleString();
    document.getElementById("endTime").innerText = new Date(endTime * 1000).toLocaleString();
    document.getElementById("lastBuyer").innerText = lastBuyer;
    document.getElementById("potSize").innerText = ethers.utils.formatEther(potSize) + " ETH";
    document.getElementById("totalKeysPurchased").innerText = totalKeysPurchased.toString();
    document.getElementById("currentTicketPrice").innerText = ethers.utils.formatEther(currentTicketPrice) + " ETH";
    document.getElementById("totalETHReceived").innerText = ethers.utils.formatEther(totalETHReceived) + " ETH";
    document.getElementById("yourKeys").innerText = yourKeys.toString();
    document.getElementById("rewardAvailable").innerText = ethers.utils.formatEther(rewardAvailable) + " ETH";
    document.getElementById("grandPrizeClaimed").innerText = grandPrizeClaimed ? "Yes" : "No";
}

async function purchaseKeys() {
    const amount = document.getElementById("keyAmount").value;
    const price = await contract.ethValue(totalKeysPurchased.add(amount)).sub(totalETHReceived);

    const tx = await contract.purchaseKeys(amount, { value: price });
    await tx.wait();
    updateGameInfo();
}

async function claimReward() {
    const tx = await contract.claimReward();
    await tx.wait();
    updateGameInfo();
}

async function claimGrandPrize() {
    const tx = await contract.claimGrandPrize();
    await tx.wait();
    updateGameInfo();
}

async function claimPrize() {
    const tx = await contract.claimPrize();
    await tx.wait();
    updateGameInfo();
}

async function transferToBankroll() {
    const tx = await contract.transferToBankroll();
    await tx.wait();
    updateGameInfo();
}
