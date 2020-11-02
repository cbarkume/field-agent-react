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
                <h2>Agents</h2>

                <table className="table table-dark table-striped table-hover">
                    <thead>
                        <tr>
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
                                <td>{agent.firstName}</td>
                                <td>{agent.middleName === "" ? "N/A" : agent.middleName}</td>
                                <td>{agent.lastName}</td>
                                <td>{agent.dob === "" ? "N/A" : agent.dob}</td>
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

                <h2>Add New Agent:</h2>

                <div>
                    {mode === 'Add' && (
                        <form className="form-inline" onSubmit={this.handleAddSubmit}>
                            <div className="form-group m-2">
                                <label htmlFor="firstName">First Name:&nbsp;</label>
                                <input className="form-control col-12" value={this.state.firstName} onChange={this.handleFirstNameChange} 
                                type="text" placeholder="Please provide a First Name." />
                                <p></p>
                                <label htmlFor="middleName">Middle Name:&nbsp;</label>
                                <input className="form-control col-12" value={this.state.middleName} onChange={this.handleMiddleNameChange} 
                                type="text" />
                                <p></p>
                                <label htmlFor="lastName">Last Name:&nbsp;</label>
                                <input className="form-control col-12" value={this.state.lastName} onChange={this.handleLastNameChange} 
                                type="text" placeholder="Please provide a Last Name." />
                                <p></p>
                                <label htmlFor="dob">Date of Birth:&nbsp;</label>
                                <input className="form-control col-12" value={this.state.dob} onChange={this.handleDateOfBirthChange} 
                                type="text" />
                                <p></p>
                                <label htmlFor="heightInInches">Height In Inches:&nbsp;</label>
                                <input className="form-control col-12" value={this.state.heightInInches} onChange={this.handleHeightInInchesChange} 
                                type="text" placeholder="Please provide a Height in Inches." />
                                <p></p>
                                <div>
                                    <button className="btn btn-success ml-1" type="submit">Submit Form</button>
                                </div>
                            </div>
                        </form>
                    )}
                    {mode === 'Edit' && (
                        <form onSubmit={this.handleEditSubmit}>
                            <hr></hr>
                            <h4>Edit Agent:</h4>
                            <label htmlFor="firstName">First Name:&nbsp;</label>
                            <input value={this.state.firstName} onChange={this.handleFirstNameChange} type="text" />
                            <p></p>
                            <label htmlFor="middleName">Middle Name:&nbsp;</label>
                            <input value={this.state.middleName} onChange={this.handleMiddleNameChange} type="text" />
                            <p></p>
                            <label htmlFor="lastName">Last Name:&nbsp;</label>
                            <input value={this.state.lastName} onChange={this.handleLastNameChange} type="text" />
                            <p></p>
                            <label htmlFor="dob">Date of Birth:&nbsp;</label>
                            <input value={this.state.dob} onChange={this.handleDateOfBirthChange} type="text" />
                            <p></p>
                            <label htmlFor="heightInInches">Height In Inches:&nbsp;</label>
                            <input value={this.state.heightInInches} onChange={this.handleHeightInInchesChange} type="text" />
                            <p></p>
                            <div>
                                <button type="submit">Submit Form</button>
                            </div>
                            <div>
                                <button onClick={this.cancelEditAgent} type="button">Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </>
        );
    }

}

export default Agents;