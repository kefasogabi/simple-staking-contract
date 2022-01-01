import React, { Component } from 'react'
import Web3 from 'web3'
import {ethers} from 'ethers'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Navbar from './Navbar'
import Main from './Main'
import Earning from './Earning'
import './App.css'
const tokenCOntractAddress = "0x9f0227A21987c1fFab1785BA3eBa60578eC1501B";
const contractAddress = "0x3bDE2550A8c435be10adfea35650c928C9C6291e";
class App extends Component {

  
  async componentWillMount() {
  if(!window.ethereum){

    /*
    account: '0x0',
      dappToken: {},
      tokenFarm: {},
      dappTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true,
      earnings:'0'
    */
     this.setState({ loading: false })
    this.setState({ account: '0x0' })
    this.setState({ dappTokenBalance: '0' })
    this.setState({ dappTokenBalance: '0' })
    this.setState({ stakingBalance: '0' })
    this.setState({ earnings: '0' })

  }
    
  }

 
  
  connectWallet =  async () => {
   

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

    const address = await window.ethereum.request({ method: 'eth_requestAccounts' });
    

    if(address.length) {
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      this.setState({ account: accounts[0] })


      // Load DappToken
     
        const dappToken = new web3.eth.Contract(DappToken, tokenCOntractAddress)
        this.setState({ dappToken })
        let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
        const convertedNumber = window.web3.utils.fromWei(dappTokenBalance, 'ether')
        this.setState({ dappTokenBalance: Number(convertedNumber.toString()).toFixed(3).toString()})
      
       const tokenFarm = new web3.eth.Contract(TokenFarm, contractAddress)
       this.setState({ tokenFarm })

       let stakingBalance = await tokenFarm.methods.userData(this.state.account).call()
       this.setState({ stakingBalance: stakingBalance[0].toString() })
       let userInfo = await tokenFarm.methods.calculateRewards(this.state.account).call()
       this.setState({ earnings: userInfo })

      this.setState({ loading: false })
    }
  
  }


 
  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.dappToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.stake(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        const tokenEvent = tokenCOntractAddress.transfer({},{fromBlock: 0, toBlock: 'latest'});
        tokenEvent.watch(function(error, result){
          console.log("on watch"); 
          console.log(arguments);
        });
        this.setState({ loading: false })
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.unStake(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  claim = () => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.unStake(0).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      dappToken: {},
      tokenFarm: {},
      dappTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true,
      earnings:'0'
    }
  }

  render() {

    let content
    let earning
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        dappTokenBalance={this.state.dappTokenBalance}
        dappTokenBalance={this.state.dappTokenBalance}
        stakingBalance={this.state.stakingBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
      />
    
    earning =  <Earning
      earnings = {this.state.earnings}
      claim = {this.claim}
    />
    }

    return (
      <div>
        <div className="container-fluid mt-5">
          <div className="container">
            <div className="col-md-12">
              <button type="button" onClick={(event) => {
                event.preventDefault()
                this.connectWallet()
              }}  className="btn btn-secondary ">Connect</button>
            </div>
            <div className="col-md-12 ">
              <div className="row">
                <div className="col-md-8">
                {content}
                </div>
                <div className="col-md-4"> 
                {earning}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
