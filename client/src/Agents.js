import React from 'react';

class Agents extends React.Component {
    constructor() {
        super();
        this.state = {
            agents: [],
            id: 0,
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
            this.setState({
                agents: data,
                id: 0,
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

        //This is a format string in js
        fetch(`http://localhost:8080/api/agent/${agentId}`, {
            //This is all you need to delete. no body, no nothing
            method: 'DELETE'
        })
        .then(response => {
            if (response.status === 204) {
                console.log('Success!');
                this.getToDos();
            } else {
                console.log('Oops! Reason: ' + response);
            }
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
                            <tr key={agent.id}>
                                <td>{agent.firstName}</td>
                                <td>{agent.middleName === "" ? "N/A" : agent.middleName}</td>
                                <td>{agent.lastName}</td>
                                <td>{agent.dob === null ? "N/A" : agent.dob}</td>
                                <td>{agent.heightInInches}</td>
                                <td>
                                    <div className='float-right'>
                                        <button className="btn btn-primary btn-sm mr-2" value={agent} type="button">Edit</button>
                                        <button className="btn btn-danger btn-sm" value={agent.firstName} onClick={() => this.handleDelete(agent.id)} type="button">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div>
                    {mode === 'Add' && (
                        <form onSubmit={this.handleAddSubmit}>
                            <hr></hr>
                            <h4>Add New Agent:</h4>
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
                        </form>
                    )}
                </div>
            </>
        );
    }

}

export default Agents;