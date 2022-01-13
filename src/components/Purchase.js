import { useEffect, useRef, useState } from 'react';
import Web3 from 'web3';
import toast, { Toaster } from "react-hot-toast";
import { IconContext } from "react-icons";
import { FaWallet, FaShoppingCart } from 'react-icons/fa';
import { BsCoin, BsCashCoin, BsBoxArrowUpRight } from 'react-icons/bs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import saleABI from "../helpers/saleABI";
import minABI from "../helpers/fswapABI";
import { saleAddress, fswapAddress } from "../helpers/contractAddresses";

ChartJS.register(ArcElement, Tooltip, Legend);


// Testing on Testnet...
// Message was changed to reflect Testnet e.g. "Please Change To BTA Test Network"
// const netID = 97;
const testnetRPC = "https://data-seed-prebsc-1-s1.binance.org:8545";

// const presaleAddress = "0x0B0ab782bc0FeF503f193d07BBFE44a018e17E31";
// const fswapAddress = "0x0732b0eEcFEfa6A05510189923732dBf804Ec2B2";

// Mainnet addresses
// Make sure to update other details to reflect Mainnet
const netID = 1657;
const mainnetRPC = "https://dataseed1.btachain.com";


const web3Inst = new Web3(mainnetRPC);
const saleContractInst = new web3Inst.eth.Contract(saleABI, saleAddress);
const fswapContractInst = new web3Inst.eth.Contract(minABI, fswapAddress);

function Purchase({account, initWeb3, getBalances}){
    
    const [amountBought, setAmountBought] = useState(40);
    const [amountRemaining, setAmountRemaining] = useState(60);
    const [claimPeriod, setClaimPeriod] = useState(0);

    const [errMessage, setErrMessage] = useState("");
    const [sucMessage, setSucMessage] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [acct, setAcct] = useState("");
    const [btaAmt, setBtaAmt] = useState("");
    const [connected, setConnected] = useState(false);
    // const [isMetaMask, setIsMetaMask] = useState(false);
    // const [MMProvider, setMMProvider] = useState({});
    // const [web3Installed, setWeb3Installed] = useState(false);
    const [ftmBal, setFtmBal] = useState(0);
    const [mmdBal, setMmdBal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isClaimLoading, setClaimIsLoading] = useState(false);


    async function buyPresale(){
        try {
            if(account === "") throw {message: "Please Connect Wallet", custom: true};
            
            const netid = await initWeb3.eth.net.getId();
            
            if(netid !== netID){
                
                throw {message: "Change To The BTAChain Mainnet", custom: true};
            }

            if(btaAmt === "") throw {message: "Enter BTA Amount", custom: true};

            if(isNaN(btaAmt)) throw {message: "Please Type In A Number", custom: true};
            
            if(btaAmt <= 0) throw {message: "BTA Amount Must Be Greater Than Zero", custom: true};
            
            setIsLoading(true);
            const gasPrice = await initWeb3.eth.getGasPrice();
            // const gas = "0xC350";
            
            const txParameters = {
                from: account,
                to: saleAddress,
                value: initWeb3.utils.toWei(btaAmt, 'ether'),
                gasPrice: gasPrice                
            };

            const data = await initWeb3.eth.sendTransaction(txParameters);
            
            const txHash = data.transactionHash;

                
            const expectedBlockTime = 1000;
            const sleep = (milliseconds) => {
                return new Promise(resolve => setTimeout(resolve, milliseconds))
            };
            let transactionReceipt = null
            
            while (transactionReceipt == null) {
                transactionReceipt = await initWeb3.eth.getTransactionReceipt(txHash);
                await sleep(expectedBlockTime)
            }
            console.log("transactionReceipt: ", transactionReceipt);

            if(transactionReceipt.status){
                setSuccess(true);
                // setError(false);

                const link = `https://btachain.com/tx/${transactionReceipt.transactionHash}`;
                
                const atag = <a href={link}>Successful. View on BTAChain</a>;
                (() => toast.success(atag))();
                updateBalances();
                
                setBtaAmt("");
                const period = await getClaimPeriods(account);
                setClaimPeriod(period);
                setIsLoading(false);

            }else{
                setError(true);
                setErrMessage("Presale Purchase Failed");
                (() => toast.error("Presale Purchase Failed"))();
                setIsLoading(false);

            }

            


        } catch (error) {
            console.log(error);
            if(error.custom){
                setErrMessage(error.message);
                (() => toast.error(error.message))();
            }else if(error.code === 4001){
                setErrMessage("Txn Signing Rejected");
                (() => toast.error("Txn Signing Rejected"))();
            }else{
                const msg = "Code: " + error.code + ", Msg: " + error.message;
                // setMessage("Transaction Failed");
                // setErrMessage(msg);
                (() => toast.error("Transaction Failed"))();
            }
            setError(true);
            setIsLoading(false);

            // Load the balances
            // getFtmBalance(account);
            // getMmdBalance(account);


        }
    }

    // Claim token
    async function claimToken(){
        try{
            if(account === "") throw {message: "Please Connect Wallet", custom: true};
            
            const netid = await initWeb3.eth.net.getId();
            
            if(netid !== netID){
                
                throw {message: "Please Change To The BTA Testnet", custom: true};
            }
            const saleContract = new initWeb3.eth.Contract(saleABI, saleAddress);
            setClaimIsLoading(true);
            const claimReceipt = await saleContract.methods.claimTokens(account).send({from: account});
            const claimEvent = claimReceipt.events.TokensClaimed;
            if(claimReceipt.events !== "undefined"){

                if(claimEvent !== "undefined"){
                    const amountClaimed = claimEvent.returnValues.amount;
                    const claimer = claimEvent.returnValues.claimer;
                    const txHash = claimEvent.transactionHash;
                    const period = await getClaimPeriods(account);
                    // https://testnet.bscscan.com/tx/0x34eee47b9d1968bda2dea2d9bd7ef222fc91ef4bfc9a9ce73fac282dc0164185
                    const link = `https://btachain.com/tx/${txHash}`;
                    
                    const atag = <a target="_blank" rel="noreferrer noopener" href={link}>Claim Successful. View on Scan</a>;
                    (() => toast.success(atag))();
                    updateBalances();
                    setClaimPeriod(period);
                    setClaimIsLoading(false);
                }
            }
            

        }catch(error){
            //
            console.log(error);
            if(error.custom){
                setErrMessage(error.message);
                (() => toast.error(error.message))();
            }else if(error.code === 4001){
                setErrMessage("Txn Signing Rejected");
                (() => toast.error("Txn Signing Rejected"))();
            }else{
                // const msg = "Code: " + error.code + ", Msg: " + error.message;
                // setErrMessage(msg);
                (() => toast.error("Transaction Failed"))();
            }
            setError(true);
            setClaimIsLoading(false);
            updateBalances();
        }
    }

    async function getClaimPeriods(acct){
        const saleContract = new initWeb3.eth.Contract(saleABI, saleAddress);
        const period = await saleContract.methods.getClaimPeriods(acct).call();
        return period;
    }

    async function updateBalances(){
        if(account !== "" && initWeb3 !== "undefined"){

            const bal = await initWeb3.utils.fromWei(await initWeb3.eth.getBalance(account));
            const roundedBBal = Number((parseFloat(bal)).toFixed(5));
            const fswapContract = new initWeb3.eth.Contract(minABI, fswapAddress);
            const fswapBal = await fswapContract.methods.balanceOf(account).call();
            const roundedFBal = Number((parseFloat(fswapBal)/10**18).toFixed(5));
            getBalances(roundedBBal, roundedFBal);
        }

    }

    useEffect(() => {
        (async function(){

            if(account !== ""){
                const period = await getClaimPeriods(account);
                setClaimPeriod(period);
            }
        })();
    }, [account]);


    useEffect(() => {
        const intervalId = setInterval(async() => {
            const bal = await fswapContractInst.methods.balanceOf(saleAddress).call();
            const amntBought = await saleContractInst.methods.tokenAmountBought().call();
            const roundedBal = Number((parseFloat(bal)/10**18).toFixed(5));
            const roundedBought = Number((parseFloat(amntBought)/10**18).toFixed(5));
            setAmountBought(roundedBought);
            setAmountRemaining(roundedBal);
        }, 3000);

        return () => clearInterval(intervalId);
            
    }, []);

    function handleChange(e){
        setBtaAmt(e.target.value);
        
    }

    
    


    const chartColors = [
        "#01c55d",
        "#0878d7"
    ];

    const Options = {
        legend: {
            display: true,
            position: "right",
        },
        elements: {
            arc: {
                borderWidth: 0
            }
        },
        animations: {
            tension: {
                duration: 1500,
                easing: 'linear',
                from: 1,
                to: 0,
                loop: true
            }
        },
        cutoutPercentage: 20
    };

    const data = {
        maintainAspectRatio: false,
        responsive: true,
        labels: ["Token Sold", "Token Remaining"],
        datasets: [
            {
                fill: false,
                data: [amountBought, amountRemaining],
                backgroundColor: chartColors,
                hoverBackgroundColor: chartColors,
                fontColor: "#fff",
            }
        ]
    };

    // Toast options
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
        <section className="section-scroll new-wave-section roadmap-section customise-section" id="roadmap">
            <div className='container claim-container'>
                {
                    account !== ""
                    ?
                    <div className='row' style={{width: "100%"}}>
                        {
                            claimPeriod > 0 
                            ? 
                            <div>
                                <p>You have {claimPeriod} claims remaining <br/> (claim every month)</p>
                                
                                <div className='col-xl-12'>
                                    <button disabled={!(claimPeriod > 0) || isClaimLoading} onClick={claimToken} className="btn btn-outline-success btn-main btn-buy">{isClaimLoading ? <img className='spinner-claim-img' alt='Spinner' src='./image/spinner.gif'></img> : <span style={{color: "#ffffff"}}>Claim</span>}</button>
                                </div>
                            </div>
                            : 
                            <div className='sale-info'>
                                <p style={{ backgroundColor: "#ff1a1a", color: "white", maxWidth: '250px', margin: "0 auto", marginBottom: "8px", borderRadius: "8px", padding: "3px 5px"}}>You have no tokens to claim</p>
                                <p>1BTA - 60FSWAP <br /> Get 40% and claim 20% monthly</p>
                                <p>Min Buy - 20BTA</p>
                                <p>Max Buy - 5000BTA</p>
                            </div>
                            
                        }
                    </div>
                    :
                    <div className='row sale-info' style={{width: "100%"}}>
                        <p>Buy And Claim Fswap Tokens Periodically</p>
                        <p>1BTA - 60FSWAP <br /> Get 40% and claim 20% monthly</p>
                        <p>Min Buy - 20BTA</p>
                        <p>Max Buy - 5000BTA</p>
                    </div>
                }
            </div>
            
            <div className="container customise-container">
                <div className="row customise-row">
                    {
                        amountRemaining > 0 
                        &&
                        <div className="col-md-4 col-lg-4 col-xl-4 chart-box">
                            <Doughnut 
                                data={data}
                                options={Options}
                            />
                        </div>
                    }
                    
                    <div className="col-md-8 col-lg-8 col-xl-8">
                        <div className="box-roadmap customise-purchase" data-aos="fade-up">
                            <h5 className="purchase-title">Partake in FSWAP sale</h5>
                            <input className="form-control" onChange={handleChange} value={btaAmt} placeholder="Enter BTA amount" />
                            <button disabled={isLoading} onClick={buyPresale} className="btn btn-outline-success btn-main btn-buy">{isLoading ? <img className='spinner-img' alt='Spinner' src='./image/spinner.gif'></img> : " Buy FSwap"}</button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    );
}

export default Purchase;