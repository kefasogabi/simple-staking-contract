import React, { Component } from 'react'

class Earning extends Component {

 
  render() {
    
    return (
      <div className="card mt-5 main__card">
        <div className="card-body main__card text-center">
          <h4 className="card-title">YOUR EARNINGS</h4>
           <div>
                <p className="stake">Staking Reward: <span>{window.web3.utils.fromWei(this.props.earnings, 'ether')} LAUNCH MONEY</span>
                </p>
            </div>
            <div><button type="submit" className="claim btn btn-primary" onClick={(event) =>{
              event.preventDefault()
              console.log("Ont really know why you are not working!!!!!!!!!!!!!!" )
              this.props.claim()
            }}>CLAIM</button></div>
           
        </div>
      </div>
    );
  }
}

export default Earning;
