import { useEffect, useState } from 'react';
import Header from './components/Header';
import Preloader from './components/Preloader';
import Purchase from './components/Purchase';
import Footer from './components/Footer';
import './App.css';
import minABI from "./helpers/fswapABI";
import { fswapAddress } from './helpers/contractAddresses';


function App() {

  const [account, setAccount] = useState("");
  const [web3Provider, setWeb3Provider] = useState(null);
  const [btaBalance, setBtaBalance] = useState(0);
  const [fswapBalance, setFswapBalance] = useState(0);

  const getBalances = (btaBal, fswapBal) => {
    setBtaBalance(btaBal);
    setFswapBalance(fswapBal);
  };

  const handleAccount = (acct) => {
    setAccount(acct);
  };

  const handleWeb3Provider = (initializedWeb3) => {
    setWeb3Provider(initializedWeb3);
  };

  

  useEffect(() => {
    (async function getFswapBalance(){
      console.log("myWeb3Provider: ", web3Provider);
      if(web3Provider !== null){

        const fswapContract = new web3Provider.eth.Contract(minABI, fswapAddress);
        if(account !== ""){
          const bal = await fswapContract.methods.balanceOf(account).call();
          const roundedBal = Number((parseFloat(bal)/10**18).toFixed(5));
          setFswapBalance(roundedBal);
        }
      }
      
    })();

    (async function getBtaBalance(){
      if(web3Provider !== null){

        if(account !== ""){
          const bal = await web3Provider.utils.fromWei(await web3Provider.eth.getBalance(account));
          const roundedBal = Number((parseFloat(bal)).toFixed(5));
          setBtaBalance(roundedBal);
        }
      }
      
    })();

    
  }, [web3Provider])

  return (
    <div className="project-app">
      <Preloader />
      <Header 
        handleWeb3={handleWeb3Provider}
        handleAccount={handleAccount}
        updatedBtaBal={btaBalance} 
        updatedFswapBal={fswapBalance}
        getBalances={getBalances}
      />
      <Purchase account={account} initWeb3={web3Provider} getBalances={getBalances} />
      <Footer />
    </div>
  );
}

export default App;
