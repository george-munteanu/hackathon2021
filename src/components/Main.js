import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
              <h2>Add problem</h2>
              <form onSubmit={(event) => {
                event.preventDefault()
                const description = this.problemDescription.value
                const category = this.category.value
                this.props.addProblem(category, description)
              }} >
                <div className="form-group mr-sm-2">
                    <label>Category:&nbsp;
                      <select name="category" id="category" ref={(input) => { this.category = input }}>
                      <option value="0">Math</option>
                      <option value="1">Physics</option>
                      <option value="2">Chemistry</option>
                      <option value="3">Geography</option>
                      <option value="4">History</option>
                    </select></label>
                    <br/>
                    <input
                      id="problemDescription"
                      type="text"
                      ref={(input) => { this.problemDescription = input }}
                      className="form-control"
                      placeholder="Problem description..."
                      required />
                </div>
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
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
                        <p>{problem.description}</p>
                        { 
                          problem.descriptionHash === '' ? 
                          <span/> :
                          <p class="text-center"><img src={`https://ipfs.infura.io/ipfs/${problem.descriptionHash}`} style={{ maxWidth: '420px'}}/></p>
                        }
                        <p>{problem.solution}</p>
                        { 
                          problem.solutionHash === '' ? 
                          <span/> :
                          <p class="text-center"><img src={`https://ipfs.infura.io/ipfs/${problem.solutionHash}`} style={{ maxWidth: '420px'}}/></p>
                        }
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={problem.key}
                          disabled={problem.createdBy !== this.props.account || problem.state !== "2"}
                          onClick={(event) => {
                            const rejectionReason = this.rejectionReason.value
                            this.props.rejectSolution(problem.key, rejectionReason)
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
                            const solution = this.problemSolution.value
                            this.props.resolveProblem(problem.key, solution)
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
                      {
                        problem.assignedTo !== this.props.account || problem.state !== "1" ? 
                        <span/> :
                        <li className="list-group-item">
                          <h2>Resolve problem</h2>
                            <div className="form-group mr-sm-2">
                                <input
                                  id="problemSolution"
                                  type="text"
                                  ref={(input) => { this.problemSolution = input }}
                                  className="form-control"
                                  placeholder="Solution..."
                                  required />
                            </div>
                            <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
                        </li>
                      }
                      {
                        problem.createdBy !== this.props.account || problem.state !== "2" ? 
                        <span/> :
                        <li className="list-group-item">
                          <h2>Reject Reason</h2>
                            <div className="form-group mr-sm-2">
                                <input
                                  id="rejectionReason"
                                  type="text"
                                  ref={(input) => { this.rejectionReason = input }}
                                  className="form-control"
                                  placeholder="Please specify if rejecting the solution..."
                                  required />
                            </div>
                        </li>
                      }
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