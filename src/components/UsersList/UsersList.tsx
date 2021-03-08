import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Table } from "react-bootstrap";
import { User, UsersProps, UsersState } from "./Models";

export class UsersList extends React.Component<UsersProps, UsersState> {
    constructor(props: UsersProps) {
        super(props)
        this.fetchUsers = this.fetchUsers.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleDelete = this.handleDelete.bind(this)

        this.state = {
            users: []
        }
    }

    componentDidMount() {
        this.fetchUsers()
    }

    fetchUsers() {
        fetch(`${process.env.REACT_APP_API_URL}user`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(async response => {
            this.setState({ users: await response.json() as User[] })
        })
    }

    handleEdit() {

    }

    handleDelete() {

    }

    render() {
        return <main className="users">
            <Table bordered hover className="mt-5 text-center">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Vérifié</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.users &&
                        this.state.users.map((user: User, index) => (
                            <tr key={index}>
                                <td>{user.firstname}</td>
                                <td>{user.lastname}</td>
                                <td>{user.email}</td>
                                <td>{user.active ? "Oui" : "Non"}</td>
                                <td><FontAwesomeIcon icon={faPen} onClick={this.handleEdit} /><FontAwesomeIcon icon={faTrash} onClick={this.handleDelete} /></td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </main>
    }
}