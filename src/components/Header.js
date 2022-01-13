import { useEffect, useRef, useState } from "react";
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import toast, { Toaster } from "react-hot-toast";
// import "../App.css";
import { FaWallet } from 'react-icons/fa';
import minABI from "../helpers/fswapABI";
import { fswapAddress } from "../helpers/contractAddresses";


// Mainnet
const netID = 1657;
const mainChainID = "0x679";
const mainnetConfig = {
    chainId: "0x679",
    chainName: 'BTAChain Mainnet',
    rpcUrls: ['https://dataseed1.btachain.com'],
    nativeCurrency: {
        name: 'Bitcoin Asset',
        symbol: 'BTA',
        decimals: 18,
    },
    blockExplorerUrls: ['https://www.btachain.com/']
};

const netName = "BTAChain Mainnet";


function Header({handleWeb3, handleAccount, updatedBtaBal, updatedFswapBal, getBalances}){

    // States
    const [sucMessage, setSucMessage] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [account, setAccount] = useState("");
    const [formattedAcct, setFormattedAcct] = useState("");
    const [connected, setConnected] = useState(false);
    const [isMetaMask, setIsMetaMask] = useState(false);
    const [MMProvider, setMMProvider] = useState({});
    const [web3Installed, setWeb3Installed] = useState(false);
    const [showAcctInfo, setShowAcctInfo] = useState(false);

    
    async function connectWallet(){
        if(web3Installed){
            if(isMetaMask){
                await loadMetaMaskWeb3();

            }else{
                await loadWeb3();

            }
            
        }else{
            setError(true);
            setErrMessage("Web3 Wallet Not Detected");
            (() => toast.error("Web3 Wallet Not Detected"))();

        }

    }

    function formatWallet(acct){
        const dots = "...";
        const firstFour = acct.substring(0, 4);
        const lastFour = acct.substring(38,42);
        const displayAcct = " " + firstFour + dots + lastFour;
        setFormattedAcct(displayAcct);
    }

    function disconnectWallet(){
        setConnected(false);
        setAccount("");
        handleAccount("");
        getBalances(0, 0);
        (() => toast.success("Wallet Disconnected!"))();

    }

    async function loadMetaMaskWeb3(){
        const netid = await window.web3.eth.net.getId();
        if(netid !== netID){
            if(isMetaMask){
                try {
                    const isSwitched = await MMProvider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: mainChainID }],
                    });

                    // console.log("isSwitched: ", isSwitched);

                    if(isSwitched !== null){
                        throw {message: "isSwitched is not null", custom: true};
                    }

                    (() => toast.success("Network switched To BTAChain"))();
                } catch (switchError) {
                    // console.log(switchError);
                    if(switchError.code === -32603){
                        try {
                            const isAdded = await MMProvider.request({
                                method: 'wallet_addEthereumChain',
                                params: [mainnetConfig]
                            });

                            if(isAdded !== null){
                                throw {message: "Network Add Error", custom: true};
                            }
                            (() => toast.success("BTAChain Added"))();

                        } catch (addError) {
                            // handle "add" error
                            if(addError.code === 4001){
                                setError(true);
                                setErrMessage("Network Add Rejected");
                                (() => toast.error("Network Add Rejected"))();
                            
                            }else{
                                setError(true);
                                setErrMessage("Network Add Error");
                                (() => toast.error("Network Add Error"))();
                            }
                            return;
                        }
                    
                    }else if(switchError.code === 4902){
                        
                        try {
                            const isAdded = await MMProvider.request({
                                method: 'wallet_addEthereumChain',
                                params: [mainnetConfig]
                            });

                            if(isAdded !== null){
                                throw {message: "Network Add Error", custom: true};
                            }
                            (() => toast.success("BTAChain Added"))();


                        } catch (addError) {
                            // handle "add" error
                            if(addError.code === 4001){
                                setError(true);
                                setErrMessage("Network Add Rejected");
                                (() => toast.error("Network Add Rejected"))();
                            
                            }else{
                                setError(true);
                                setErrMessage("Network Add Error");
                                (() => toast.error("Network Add Error"))();
                            }
                            return;
                        }
                    
                    }else if(switchError.custom){
                        // Show custom error
                        setError(true);
                        setErrMessage(switchError.message);
                        (() => toast.error(switchError.message))();
                        return;
                    }else{
                        // Show error
                        setError(true);
                        // const msg = 'Code: ' + switchError.code + ', Msg: ' + switchError.message;
                        setErrMessage(`Please Change To ${netName}`);
                        (() => toast.error(`Please Change To ${netName}`))();
                        
                        return;
                    }
                }

            }else{
                setError(true);
                setErrMessage(`Please Change To ${netName}`);
                (() => toast.error(`Please Change To ${netName}`))();
                return;
            }
        }

        try {
            if(account === ""){
               const accounts = await MMProvider.request({ method: 'eth_requestAccounts' });
               setAccount(accounts[0]);
               handleAccount(accounts[0]);
               formatWallet(accounts[0]);
               getBothBalances(accounts[0]);
               setConnected(true);
               setSuccess(true);
               setSucMessage("Wallet Connected");
               (() => toast.success("Wallet Connected"))();
            }
            
        } catch (error) {
            console.log(error);
            setError(true);
            setErrMessage("MetaMask Wallet Connection Error");
            (() => toast.error("MetaMask Wallet Connection Error"))();
        }
    }

    async function loadWeb3(){
        window.web3 = new Web3(window.web3.currentProvider);

        try {
            const isSameID = await window.web3.eth.net.getId() !== netID;
            if(isSameID){
                setError(true);
                setErrMessage(`Please Change To ${netName}`);
                (() => toast.error(`Please Change To ${netName}`))();
                return;
            }

            const accounts = await window.web3.eth.getAccounts();
            setAccount(accounts[0]);
            handleAccount(accounts[0]);
            formatWallet(accounts[0]);
            setConnected(true);
            setSucMessage("Wallet connected!");
            (() => toast.success("Wallet connected!"))();
            
        } catch (error) {
            console.log(error);
            setError(true);
            setErrMessage("Web3 Wallet Connection Error");
            (() => toast.error("Web3 Wallet connection Error"))();
        }

    }

    useEffect(() => {
        (async () => {
            const MetaMProvider = await detectEthereumProvider();
            if(MetaMProvider === window.ethereum){
                setMMProvider(MetaMProvider);
                setWeb3Installed(true);
                setIsMetaMask(true);
                window.web3 = new Web3(window.ethereum);
                const customWeb3 = new Web3(window.ethereum);
                customWeb3.isSet = true;
                handleWeb3(customWeb3);
            }else if(window.web3){
                setWeb3Installed(true);
                window.web3 = new Web3(window.web3.currentProvider);
                const customWeb3 = new Web3(window.web3.currentProvider);
                customWeb3.isSet = true;
                handleWeb3(customWeb3);
            }else{

            }
        })();
    }, []);


    // Effects of account change
    useEffect(() => {
        getBothBalances(account);
        formatWallet(account);
    }, [account]);

    
    

   
    useEffect(() => {
        if(window.ethereum){

            // MetaMask account changed
            window.ethereum.on('accountsChanged', function (accounts) {
                if(typeof account != "undefined"){
                    setAccount(accounts[0]);
                    handleAccount(accounts[0]);
                   
                    // Load the balances
                    getBothBalances(accounts[0]);
                    setConnected(true);

                }
                
            });

            // Reload the dApp interface on chain change
            window.ethereum.on('chainChanged', (_chainId) => window.location.reload());

        }
    });

    const toggleAcctInfo = () => {
        setShowAcctInfo(showAcctInfo => !showAcctInfo);
    };

    
    const showInfo = () => {
        setShowAcctInfo(true);
    };

    const hideInfo = () => {
        setShowAcctInfo(false);
    };

    
    async function getBothBalances(acct){
        if(acct !== ""){
           const btabal = await window.web3.utils.fromWei(await window.web3.eth.getBalance(acct));
           const fswapContract = new window.web3.eth.Contract(minABI, fswapAddress);
            const fswapbal = await fswapContract.methods.balanceOf(acct).call();
           const roundedbBal = Number((parseFloat(btabal)).toFixed(5));
            const roundedfBal = Number((parseFloat(fswapbal)/10**18).toFixed(5));

           getBalances(roundedbBal, roundedfBal);

        }
    }




    const tOptions = {
        error: {
            style: {
            background: '#ff1a1a',
            color: '#ffffff',
            paddingRight: '30px',
            paddingLeft: '30px',
            fontWeight: '500',
            fontSize: '18px'
            }
        }
    };
    

    
    
    
    return(
        <nav className="navbar navbar-expand-md navbar-dark fixed-top navbar-index" id="index_nav">
            <div className="container size-navbar" id="size">
                <a href="/"><img className="logo-image" src="image/logo.png" alt="logo" width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" /></a>

                <button id="nav_btn" onClick={connected ? toggleAcctInfo : connectWallet}  className="btn btn-outline-success btn-main align-right custom-center-btn">
                    
                    <span><FaWallet />{connected ? " " + formattedAcct : " Connect Wallet"}</span>
                
                    {
                        showAcctInfo 
                        &&
                        <div className="userAcctInfo" onMouseEnter={showInfo} onMouseLeave={hideInfo}>
                            <p className="currencyName">BTA: </p>
                            <p className="currencyAmt">{updatedBtaBal}</p>
                            <p className="currencyName">Fswap: </p>
                            <p className="currencyAmt">{updatedFswapBal}</p>

                            <button onClick={disconnectWallet} className="btn btn-danger">Disconnet</button>
                        </div>
                    }
                </button>
                
            </div>
            <Toaster toastOptions={tOptions} />

        </nav>

    );
}


export default Header;