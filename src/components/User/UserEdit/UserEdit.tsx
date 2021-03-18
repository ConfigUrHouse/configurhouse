import { faAt, faSave, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik } from "formik";
import React from "react";
import { Button, Col, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import { withRouter } from "react-router";
import * as Yup from "yup";
import { ApiResponseError } from "../../../api/models";
import { apiRequest } from "../../../api/utils";
import { Role, User, UserRole } from "../Models";
import { FormValues, UserEditProps, UserEditState } from "./Models";
import './UserEdit.css'

export class UserEdit extends React.Component<UserEditProps, UserEditState> {
    constructor(props: UserEditProps) {
        super(props);

        this.handleRoleChange = this.handleRoleChange.bind(this)
        this.submitForm = this.submitForm.bind(this)

        const id = parseInt(this.props.match.params.id)
        this.state = {
            id,
            availableRoles: [],
            formValues: this.initialValues,
            error: undefined
        }
    }

    schema = Yup.object().shape({
        roles: Yup.array().of(Yup.number())
    });

    initialValues: FormValues = {
        firstname: "",
        lastname: "",
        email: "",
        verified: false,
        roles: []
    }

    componentDidMount() {
        this.fetchUser()
        this.fetchUserRoles()
        this.fetchAvailableRoles()
    }

    async fetchUser(): Promise<void> {
        apiRequest(`user/${this.state.id}`, 'GET', [])
            .then(response => {
                if (response.status === "error") {
                    this.setState({ error: response as ApiResponseError })
                } else {
                    const user = (response as User)
                    this.setState({
                        formValues: {
                            ...this.state.formValues,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            email: user.email,
                            verified: !!user.active
                        }
                    })
                }
            })
            .catch(error => console.log(error))
    }

    async fetchUserRoles(): Promise<void> {
        try {
            const userRoles: UserRole[] = await apiRequest(
                `userRole/${this.state.id}`,
                'GET',
                []
            )
            this.setState({
                formValues: {
                    ...this.state.formValues,
                    roles: userRoles.map(userRole => userRole.id)
                }
            })
        } catch (error) {
            this.setState({
                formValues: {
                    ...this.state.formValues,
                    roles: []
                }
            })
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
        let roles = [...this.state.formValues.roles];
        if (e.target.checked) {
            roles.push(parseInt(e.target.value));
        } else {
            roles = roles.filter(roleId => roleId !== parseInt(e.target.value))
        }
        this.setState({ formValues: { ...this.state.formValues, roles } })
    }

    async submitForm(values: FormValues): Promise<void> {
        apiRequest(
            `user/${this.state.id}/update-roles`,
            'PUT',
            this.state.formValues.roles.map(role => `roles=${role}`)
        ).then(response => {
            this.props.history.push("/users")
        }).catch(error => {

        })
    }

    render() {
        return (
            <main className="p-5 w-100 bg">
                <div className="circle1"></div>
                <div className="circle2"></div>
                <div className="p-5 form w-75 mx-auto">
                    <h3 className="mb-2"><FontAwesomeIcon className="mr-2" icon={faUser} />Editer un utilisateur</h3>
                    <Formik
                        validationSchema={this.schema}
                        onSubmit={values => {
                            this.submitForm(values);
                        }}
                        initialValues={this.initialValues}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            values,
                            errors,
                        }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text id="FirstnameIcon"><FontAwesomeIcon icon={faUser} /></InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl
                                                placeholder="Prénom"
                                                name="firstname"
                                                value={this.state.formValues.firstname}
                                                disabled
                                            />
                                        </InputGroup>
                                    </Col>
                                    <Col md={6}>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text id="LastnameIcon"><FontAwesomeIcon icon={faUser} /></InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl
                                                placeholder="Nom de famille"
                                                name="lastname"
                                                value={this.state.formValues.lastname}
                                                disabled
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.lastname}
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Col>
                                </Row>

                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="MailIcon"><FontAwesomeIcon icon={faAt} /></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        placeholder="Adresse email"
                                        name="email"
                                        value={this.state.formValues.email}
                                        disabled
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </InputGroup>
                                {this.state.availableRoles.map(role =>
                                    <Form.Check
                                        key={role.id}
                                        id={`role${role.id}`}
                                        name="roles"
                                        label={role.name}
                                        value={role.id}
                                        checked={this.state.formValues.roles.includes(role.id)}
                                        onChange={this.handleRoleChange}
                                    />
                                )}
                                <Button variant="primary" className="d-block mx-auto mt-3 p-3" type="submit">
                                    SAUVEGARDER <FontAwesomeIcon className="ml-2" icon={faSave} />
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </main>)
    }
}

export const UserEditWithRouter = withRouter(UserEdit);