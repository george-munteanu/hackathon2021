import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              <h2>Add problem</h2>
              <form onSubmit={(event) => {
                event.preventDefault()
                const description = this.problemDescription.value
                this.props.addProblem(description)
              }} >
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
                  <div className="form-group mr-sm-2">
                    <br></br>
                      <input
                        id="problemDescription"
                        type="text"
                        ref={(input) => { this.problemDescription = input }}
                        className="form-control"
                        placeholder="Problem description..."
                        required />
                  </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">Add</button>
              </form>
              <p>&nbsp;</p>
              { this.props.problems.map((problem, key) => {
                return(
                  <div className="card mb-4" key={key} >
                    <div className="card-header">
                      <img
                        className='mr-2'
                        width='30'
                        height='30'
                        src={`data:image/png;base64,${new Identicon(problem.createdBy, 30).toString()}`}
                      />
                      <small className="text-muted">{problem.createdBy}</small>
                    </div>
                    <ul id="problemList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p class="text-center"><img src={`https://ipfs.infura.io/ipfs/${problem.descriptionHash}`} style={{ maxWidth: '420px'}}/></p>
                        <p>{problem.description}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                      <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={problem.key}
                          disabled={problem.createdBy !== this.props.account || problem.state !== "2"}
                          onClick={(event) => {
                            this.props.rejectSolution(problem.key, "dummy solution rejection reason")
                          }}
                        >
                          Reject
                        </button>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={problem.key}
                          disabled={problem.createdBy !== this.props.account || problem.state !== "2"}
                          onClick={(event) => {
                            this.props.approveSolution(problem.key)
                          }}
                        >
                          Aprove
                        </button>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={problem.key}
                          disabled={problem.assignedTo !== this.props.account || problem.state !== "1"}
                          onClick={(event) => {
                            this.props.resolveProblem(problem.key,"dummy solution description")
                          }}
                        >
                          Resolve
                        </button>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={problem.key}
                          disabled={problem.createdBy === this.props.account || problem.state !== "0"}
                          onClick={(event) => {
                            this.props.assignProblem(problem.key)
                          }}
                        >
                          Assign
                        </button>                                               
                      </li>
                    </ul>
                  </div>
                )
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;