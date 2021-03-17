import { FieldArray, Formik } from "formik";
import React, { ChangeEvent, FormEvent } from "react";
import { Button, Form, ToggleButtonCheckboxProps } from "react-bootstrap";
import { withRouter } from "react-router";
import * as Yup from "yup";
import { apiRequest } from "../../../api/utils";
import { Role, User, UserRole } from "../Models";
import { UserEditProps, UserEditState } from "./Models";

export class UserEdit extends React.Component<UserEditProps, UserEditState> {
    constructor(props: UserEditProps) {
        super(props);

        this.handleRoleChange = this.handleRoleChange.bind(this)
        this.submitForm = this.submitForm.bind(this)

        const id = parseInt(this.props.match.params.id)
        this.state = {
            id,
            user: undefined,
            availableRoles: [],
            roles: []
        }
    }

    schema = Yup.object().shape({
        roles: Yup.array().of(Yup.number())
    });

    initialValues = {
        roles: []
    }

    componentDidMount() {
        this.fetchUser()
        this.fetchUserRoles()
        this.fetchAvailableRoles()
    }

    async fetchUser(): Promise<void> {
        apiRequest(`user/${this.state.id}`, 'GET', [])
            .then(response => this.setState({ user: response as User }))
            .catch(error => console.log(error))
    }

    async fetchUserRoles(): Promise<void> {
        try {
            const userRoles: UserRole[] = await apiRequest(
                `userRole/${this.state.id}`,
                'GET',
                []
            )
            this.setState({ roles: userRoles.map(userRole => userRole.id) })
        } catch (error) {
            this.setState({ roles: [] })
        }
    }

    async fetchAvailableRoles(): Promise<void> {
        try {
            const roles: Role[] = await apiRequest(
                'role',
                'GET',
                []
            );
            this.setState({ availableRoles: roles });
        } catch (error) {
            this.setState({ availableRoles: [] });
        }
    }

    handleRoleChange(e: any) {
        let roles = [...this.state.roles];
        if (e.target.checked) {
            roles.push(parseInt(e.target.value));
        } else {
            roles = roles.filter(roleId => roleId !== parseInt(e.target.value))
        }
        this.setState({ roles })
    }

    async submitForm(e: FormEvent): Promise<void> {
        console.log(e)
        e.preventDefault();
        try {
            await apiRequest(
                `user/${this.state.id}/update-roles`,
                'PUT',
                this.state.roles.map(role => `roles=${role}`)
            )
        } catch (error) {
            //TODO handle error
        }
    }

    render() {
        return <main className="users">
            {this.state.user && <div className="userDetails">
                <div> 
                    {this.state.user.firstname} {this.state.user.lastname}
                </div>
                <div>
                    {this.state.user.email}
                </div>
            </div>}
            <Form onSubmit={this.submitForm}>
                {this.state.availableRoles.map(role =>
                    <Form.Group key={role.id}>
                        <Form.Label>{role.name}</Form.Label>
                        <Form.Control
                            id="roles"
                            type="checkbox"
                            value={role.id}
                            checked={this.state.roles.includes(role.id)}
                            onChange={this.handleRoleChange}
                        />
                    </Form.Group>
                )}
                <Button variant="primary" type="submit">
                    Sauvegarder
                </Button>
            </Form>
        </main>
    }
}

export const UserEditWithRouter = withRouter(UserEdit);