import Tutoring from '../abis/Tutoring.json'
import User from '../abis/User.json'
import Donation from '../abis/Donation.json'
import React, { Component } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
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

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()

    const tutoringData = Tutoring.networks[networkId]
    if(tutoringData) {
      const tutoring = new web3.eth.Contract(Tutoring.abi, tutoringData.address)
      this.setState({ tutoring: tutoring })
      const problemCount = await tutoring.methods.problemCount().call()
      this.setState({ problemCount: problemCount })
      // Load problems
      for (var i = 0; i < problemCount; i++) {
        const problem = await tutoring.methods.problemList(i).call()
        console.log(problem)
        this.setState({
          problems: [...this.state.problems, problem]
        })
      }
    } else {
      window.alert('Tutoring contract not deployed to detected network.')
    }

    const userData = User.networks[networkId]
    if(userData) {
      const user = new web3.eth.Contract(User.abi, userData.address)
      this.setState({ user })

      const owner = await user.methods.owner().call()
      console.log(owner)
      this.setState({ owner: owner })

      const moderatorsCount = await user.methods.userCount().call()
      this.setState({ moderatorsCount: moderatorsCount })
      // Load moderators
      for (i = 0; i < moderatorsCount; i++) {
        const moderator = await user.methods.userList(i).call()
        console.log(moderator)
        this.setState({
          moderators: [...this.state.moderators, moderator]
        })
      }
    } else {
      window.alert('User contract not deployed to detected network.')
    }

    const donationData = Donation.networks[networkId]
    if(donationData) {
      const donation = new web3.eth.Contract(Donation.abi, donationData.address)
      this.setState({ donation })
      this.setState({ loading: false})
    } else {
      window.alert('Donation contract not deployed to detected network.')
    }

  }

  captureFile = event => {

    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  addProblem(category, description) {
    let imageHash='';

    if(this.state.buffer !== undefined) {
      ipfs.add(this.state.buffer, (error, result) => {
        console.log('Ipfs result', result)
        if(error) {
          console.error(error)
          return
        }
        imageHash = result[0].hash;
        this.setState({ loading: true })
        this.state.tutoring.methods.createProblem(category, description, imageHash).send({ from: this.state.account }).on('transactionHash', (hash) => {
          this.setState({ loading: false })
        })
      })
    } else {
      this.setState({ loading: true })
      this.state.tutoring.methods.createProblem(category, description, imageHash).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    }
  }

  assignProblem(key) {
      this.setState({ loading: true })
      this.state.tutoring.methods.assignProblem(key).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
  }

  resolveProblem(key, solution) {
    console.log(this.state.buffer);
    let imageHash='';

    if(this.state.buffer !== undefined) {
      ipfs.add(this.state.buffer, (error, result) => {
        console.log('Ipfs result', result)
        if(error) {
          console.error(error)
          return
        }
        imageHash = result[0].hash;
        this.setState({ loading: true })
        this.state.tutoring.methods.resolveProblem(key, solution, imageHash).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
        })
      }) 
    } else {
        this.setState({ loading: true })
        this.state.tutoring.methods.resolveProblem(key, solution, imageHash).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    }
 }

  approveSolution(key) {
    this.setState({ loading: true })
    this.state.tutoring.methods.approveSolution(key).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  rejectSolution(key, rejectionReason) {
    this.setState({ loading: true })
    this.state.tutoring.methods.rejectSolution(key, rejectionReason).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  addModerator(adress) {
    this.setState({ loading: true })
    this.state.user.methods.addUser(adress).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  removeModerator(adress) {
    this.setState({ loading: true })
    this.state.user.methods.removeUser(adress).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  donate(amount) {
    this.setState({ loading: true })
    this.state.donation.methods.donate().send({ from: this.state.account, value: amount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      tutoring: null,
      user: null,
      donation: null,
      problems: [],
      moderators: [],
      loading: true
    }

    this.addProblem = this.addProblem.bind(this)
    this.captureFile = this.captureFile.bind(this)
    this.assignProblem = this.assignProblem.bind(this)
    this.resolveProblem = this.resolveProblem.bind(this)
    this.approveSolution = this.approveSolution.bind(this)
    this.rejectSolution = this.rejectSolution.bind(this)
    this.addModerator = this.addModerator.bind(this)
    this.removeModerator = this.removeModerator.bind(this)
    this.donate = this.donate.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} 
                donate={this.donate}
        />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              account={this.state.account}
              problems={this.state.problems}
              captureFile={this.captureFile}
              addProblem={this.addProblem}
              assignProblem={this.assignProblem}
              resolveProblem={this.resolveProblem}
              approveSolution={this.approveSolution}
              rejectSolution={this.rejectSolution}
              owner={this.state.owner}
              addModerator={this.addModerator}
              removeModerator={this.removeModerator}
              moderators={this.state.moderators}
            />
        }
      </div>
    );
  }
}

export default App;