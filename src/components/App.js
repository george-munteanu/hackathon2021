import React, { Component } from 'react'
import Web3 from 'web3'
import Tutoring from '../abis/Tutoring.json'
import './App.css'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  createProblem()  {
    this.state.tutoring.methods.createProblem("1", "title","description").send({ from: this.state.account }).on('transactionHash', (hash) => {
      
    })
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()

    // Load Tutoring
    const tutoringData = Tutoring.networks[networkId]
    if(tutoringData) {
      const tutoring = new web3.eth.Contract(Tutoring.abi, tutoringData.address)
      this.setState({ tutoring })
      let problemList = await tutoring.methods.problemList().call()
      this.setState({ problemList })
      console.log(problemList)
    } else {
      window.alert('Tutoring contract not deployed to detected network.')
    }

    this.setState({ loading: false })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      tutoring: {},
      problemList: {}
    }
  }

  render() {

    return (
      <div id="content" className="mt-3">
        {this.state.account}

        <div className="card mb-4">
          <div className="card-body">
            <p>Problem List</p>
          </div>
        </div>

        <button
              type="submit"
              className="btn btn-link btn-block btn-sm"
              onClick={(event) => {
                event.preventDefault()
                this.createProblem()
              }}>
                Add Problem
              </button>
        
      </div>
      
    );
  }
}

export default App;
