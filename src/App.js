import logo from './logo.svg';
import './App.css';



// 1. First import web3 and abi.json file , also React useEffect
import Web3 from 'web3';
import React, { useState, useEffect, useRef } from 'react';
// Notes that this file can only store within src, otherwise it is not accessible 
import Migrations from './abi/Migrations.json';


const App = () => {

  //  2. Initialize function when rendereing
  useEffect(() => {

    // connectWeb3 is the major function of how abi connect to web3
    connectWeb3();


  })


  // 3. We would have some state to store the data for later use , all customiable
  const [assetBalance, setAssetBalance] = useState();
  let [account, setAccount] = useState("CONNECT YOUR WALLET");
  const [deployed, setDeployed] = useState(false);
  const [MIG, setMIG] = useState();
  const [MIGAddress, setMIGAddress] = useState();
  const decimals = 1000000000000000000;



  // 4. *** ConnectWeb3 function, would use async and await 
  const connectWeb3 = async () => {
    if (window.web3 && !deployed) {
      window.web3 = new Web3(window.web3.currentProvider);
      await window.ethereum.enable();

      const web3js = await window.web3;
      const accounts = await web3js.eth.getAccounts();
      // accounts 0 would be our current account 
      let balances = await web3js.eth.getBalance(accounts[0]);
      // asset balances would be storing ETH/BNB depend on network , and display 4 decimals
      setAssetBalance((balances / decimals).toFixed(4))

      // It is important for us to identify the network
      const networkID = await web3js.eth.net.getId();
      // To ensure the network correct
      console.log(networkID)
      setAccount(accounts[0]);
      // I usually console.log the state to ensure it has our expected value
      await console.log(account);

      // in here, we choose the data depends on which networkID we got above,so no need to manual input 
      const contractData = await Migrations.networks[networkID];
      if (web3js && !deployed) {
        // To ensure the data is initalized to avoid undefined error
        if (Migrations) {
          // *** It is where we would use ABI
          const migration = await new web3js.eth.Contract(Migrations.abi, contractData.address)


          await setMIGAddress(contractData.address)
          console.log(MIGAddress)

          // and we pass the array into state
          await setMIG(migration)
          // If you see a contract with array,it is working and call the function now in web3
          console.log("Contract Initalized.", MIG)

          // You can call function 

          // To avoid infinite initalize
          setDeployed(true)

        }
      }
    }

  }


  // Function example
  const functionExmaple = async () => {
    if (MIG) {
      MIG.methods.setCompleted().send({
        from: account
      }
      )
    }
  }
















  return (
    <div className="App">

      <div>
        FOR BSC Testnet:
      </div>
      Account:{account}
      <div>

      </div>
      Contract Address(if this not null means success):
      <div></div>{MIGAddress}

    </div>
  );
}

export default App;
