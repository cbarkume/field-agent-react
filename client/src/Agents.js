import React from 'react';

class Agents extends React.Component {
    constructor() {
        super();
        this.state = {
            agents: [],
            agentId: 0,
            firstName: '',
            middleName: '',
            lastName: '',
            dob: '',
            heightInInches: 0,
            mode: "Add"
        };
    }

    getAgents() {
        fetch('http://localhost:8080/api/agent')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            this.setState({
                agents: data,
                agentId: 0,
                firstName: '',
                middleName: '',
                lastName: '',
                dob: '',
                heightInInches: 0,
                mode: "Add"
            });
        });
    }

    componentDidMount() {
        this.getAgents();
    }

    handleFirstNameChange = (event) => {
        this.setState({
            firstName: event.target.value
        })
    }

    handleMiddleNameChange = (event) => {
        this.setState({
            middleName: event.target.value
        })
    }

    handleLastNameChange = (event) => {
        this.setState({
            lastName: event.target.value
        })
    }

    handleDateOfBirthChange = (event) => {
        this.setState({
            dob: event.target.value
        })
    }

    handleHeightInInchesChange = (event) => {
        this.setState({
            heightInInches: event.target.value
        })
    }

    handleAddSubmit = (event) => {
        event.preventDefault();

        fetch('http://localhost:8080/api/agent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: this.state.firstName,
                middleName: this.state.middleName,
                lastName: this.state.lastName,
                dob: this.state.dob,
                heightInInches: this.state.heightInInches
            })
        })
        .then(response => {
            if (response.status === 201) {
                console.log('Success!');
                response.json().then(data => console.log(data));

                this.getAgents();
            } else if (response.status === 400) {
                console.log('Errors!');
                response.json().then(data => {
                    console.log(data);
                });
            } else {
                console.log('Oops!')
            }
        });
    }

    handleDelete = (agentId) => {
        console.log(agentId);

        fetch(`http://localhost:8080/api/agent/${agentId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.status === 204) {
                console.log('Success!');
                this.getAgents();
            } else {
                console.log('Oops! Reason: ' + response);
            }
        });   
    }

    handleEdit = (agentId) => {
        console.log(agentId);

        fetch(`http://localhost:8080/api/agent/${agentId}`) 
            .then(response => response.json())
            .then(({ agentId, firstName, middleName, lastName, dob, heightInInches }) => {
                this.setState({
                    agentId,
                    firstName,
                    middleName,
                    lastName,
                    dob,
                    heightInInches,
                    mode: 'Edit'
                });
            console.log(this.state);
        });
    }

    handleEditSubmit = (event) => {
        event.preventDefault();

        const { agentId, firstName, middleName, lastName, dob, heightInInches } = this.state;

        fetch(`http://localhost:8080/api/agent/${agentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                agentId,
                firstName,
                middleName,
                lastName,
                dob,
                heightInInches
            })
        })
        .then(response => {
            if (response.status === 204) {
                console.log('Success!');
                this.getAgents();
            } else if (response.status === 400) {
                console.log('Erros!');
                response.json().then(data => {
                    console.log(data);
                });
            } else {
                console.log('Oops!');
            }
        })
    }

    cancelEditAgent = () => {
        this.setState({
            agentId: 0,
            firstName: '',
            middleName: '',
            lastName: '',
            dob: '',
            heightInInches: 0,
            mode: "Add"
        });
    }

    render() {
        const {
            mode
        } = this.state;

        return (
            <>
                <blockquote class="blockquote text-center">
                    <hr></hr>
                    <h1><p class="mb-0">Agents:</p></h1>
                    <hr></hr>
                </blockquote>

                <table className="table table-striped table-hover">
                    <thead class="thead-dark">
                        <tr>
                        <th scope="col">ID Number</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Middle Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Date of Birth</th>
                        <th scope="col">Height in Inches</th>
                        <th scope="col">&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.agents.map(agent => (
                            <tr key={agent.agentId}>
                                <td>{agent.agentId}</td>
                                <td>{agent.firstName}</td>
                                <td>{agent.middleName === "" ? "N/A" : agent.middleName}</td>
                                <td>{agent.lastName}</td>
                                <td>{agent.dob === null ? "N/A" : agent.dob}</td>
                                <td>{agent.heightInInches}</td>
                                <td>
                                    <div className='float-right'>
                                        <button className="btn btn-primary btn-sm mr-2" value={agent.agentId} onClick={() => this.handleEdit(agent.agentId)} type="button">Edit</button>
                                        <button className="btn btn-danger btn-sm" value={agent.agentId} onClick={() => this.handleDelete(agent.agentId)} type="button">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    {mode === 'Add' && (
                        <form onSubmit={this.handleAddSubmit}>
                            <blockquote class="blockquote text-center">
                                <h3><p class="mb-0">Add New Agent</p></h3>
                                <hr></hr>
                            </blockquote>
                            <div class="form-row">
                                <div class="form-group col-md-4">
                                    <label htmlFor="firstName">First Name:&nbsp;</label>
                                    <input className="form-control col-12" value={this.state.firstName} onChange={this.handleFirstNameChange} 
                                    type="text" placeholder="First Name" />
                                </div>
                                <div class="form-group col-md-4">
                                    <label htmlFor="middleName">Middle Name:&nbsp;</label>
                                    <input className="form-control col-12" value={this.state.middleName} onChange={this.handleMiddleNameChange} 
                                    type="text" placeholder="Middle Name" />
                                </div>
                                <div class="form-group col-md-4">
                                    <label htmlFor="lastName">Last Name:&nbsp;</label>
                                    <input className="form-control col-12" value={this.state.lastName} onChange={this.handleLastNameChange} 
                                    type="text" placeholder="Last Name" />
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label htmlFor="dob">Date of Birth:&nbsp;</label>
                                    <input className="form-control col-12" value={this.state.dob} onChange={this.handleDateOfBirthChange} 
                                    type="text" placeholder="Date of Birth (yyyy-mm-dd)" />
                                </div>
                                <div class="form-group col-md-6">
                                    <label htmlFor="heightInInches">Height In Inches:&nbsp;</label>
                                    <input className="form-control col-12" value={this.state.heightInInches} onChange={this.handleHeightInInchesChange} 
                                    type="text" placeholder="Height (Inches)" />
                                </div>
                            </div>
                             <button className="btn btn-success ml-1" type="submit">Add Agent</button>
                        </form>
                    )}
                    {mode === 'Edit' && (
                        <form onSubmit={this.handleEditSubmit}>
                            <blockquote class="blockquote text-center">
                                <h3><p class="mb-0">Edit Agent</p></h3>
                                <hr></hr>
                            </blockquote>
                            <div className="form-row">
                                <div className="form-group col">
                                    <label htmlFor="agentId">ID Number:&nbsp;</label>
                                    <input className="form-control col-12" type="text" placeholder={this.state.agentId} readOnly />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col">
                                    <label htmlFor="firstName">First Name:&nbsp;</label>
                                    <input className="form-control col-12" value={this.state.firstName} onChange={this.handleFirstNameChange} 
                                    type="text" placeholder="First Name" />
                                </div>
                                <div className="form-group col">
                                    <label htmlFor="middleName">Middle Name:&nbsp;</label>
                                    <input className="form-control col-12" value={this.state.middleName} onChange={this.handleMiddleNameChange} 
                                    type="text" placeholder="Middle Name" />
                                </div>
                                <div className="form-group col">
                                    <label htmlFor="lastName">Last Name:&nbsp;</label>
                                    <input className="form-control col-12" value={this.state.lastName} onChange={this.handleLastNameChange} 
                                    type="text" placeholder="Last Name" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col">
                                    <label htmlFor="dob">Date of Birth:&nbsp;</label>
                                    <input className="form-control col-12" value={this.state.dob} onChange={this.handleDateOfBirthChange} 
                                    type="text" placeholder="Date of Birth (yyyy-mm-dd)" />
                                </div>
                                <div className="form-group col">
                                    <label htmlFor="heightInInches">Height In Inches:&nbsp;</label>
                                    <input className="form-control col-12" value={this.state.heightInInches} onChange={this.handleHeightInInchesChange} 
                                    type="text" placeholder="Height (Inches)" />
                                </div>
                            </div>
                            <button className="btn btn-primary ml-1" type="submit">Edit Agent</button>
                            <button className="btn btn-danger ml-1" onClick={this.cancelEditAgent} type="button">Cancel</button>
                        </form>
                    )}
                    <hr></hr>
                </div>
            </>
        );
    }

}

export default Agents;