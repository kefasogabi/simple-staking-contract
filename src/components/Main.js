import { ethers } from 'ethers';
import React, { Component } from 'react'
import dai from '../logo.svg'

class Main extends Component {

    render() {
      return (

        

        <div id="content" className="mt-5">
  

  
          <div className="card mb-4 main__card" >
  
            <div className="card-body">
  
              <form className="mb-3" onSubmit={(event) => {
                  event.preventDefault()
                  let amount
                  amount = this.input.value.toString()
                  amount = window.web3.utils.toWei(amount, 'Ether')
                  console.log(amount)
                  this.props.stakeTokens(amount)
                }}>
                <div>
                  <label className="float-left"><b>Stake Tokens</b></label>
                  <span className="float-right ">
                  Available amount: {window.web3.utils.fromWei(this.props.dappTokenBalance, 'Ether')}
                  </span>
                </div>
                <div className="input-group mb-4">
                  <input
                    type="text"
                    ref={(input) => { this.input = input }}
                    className="form-control form-control-lg inputClass"
                    placeholder="0"
                    required />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <img src={dai} height='32' alt=""/>
                      &nbsp;&nbsp;&nbsp; LMY
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">STAKE!</button>
              </form>
              </div>
          </div>

          <div className="card mb-4 main__card" >
  
 
    <div className="card-body">
    <form className="mb-3" onSubmit={(event) => {
        event.preventDefault()
        let amount
        amount = this.input1.value.toString()
        amount = window.web3.utils.toWei(amount, 'Ether')
        this.props.unstakeTokens(amount)
      }}>
      <div>
        <label className="float-left"><b>Unstake Tokens</b></label>
        <span className="float-right ">
        Available amount: {window.web3.utils.fromWei(this.props.stakingBalance,'wei')}
        </span>
      </div>
      <div className="input-group mb-4">
        <input
          type="text"
          ref={(input1) => { this.input1 = input1 }}
          className="form-control form-control-lg inputClass"
          placeholder="0"
          required />
        <div className="input-group-append">
          <div className="input-group-text">
            <img src={dai} height='32' alt=""/>
            &nbsp;&nbsp;&nbsp; LMY
          </div>
        </div>
      </div>
      <button type="submit" className="btn btn-primary btn-block btn-lg">UNSTAKE!</button>
    </form>
    </div>
</div>
  
        </div>
      
      );
    }
  }
  
  export default Main;
  