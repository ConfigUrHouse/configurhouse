import { Formik } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import { withRouter } from "react-router";
import * as Yup from "yup";
import { apiRequest } from "../../../api/utils";
import { UserProps } from "./Models";

export class UserEdit extends React.Component<UserProps, { id: number }> {
    // constructor(props: UserProps) {
    //     super(props);

    // }

    schema = Yup.object().shape({
        roles: Yup.array().of(Yup.number())
    });

    initialValues = {
        roles: []
    }

    componentDidMount() {
        this.fetchUser(parseInt(this.props.match.params.id));
    }

    async fetchUser(id: number): Promise<void> {
        apiRequest(`user/${id}`, 'GET', [])
            // .then(this.setState({ user: }))
            // .catch(error => console.log(error))
    }

    submitForm(): void {
        // fetch(`${process.env.REACT_APP_API_URL}user/${values.roles.map(role =>)}/update-roles`, {
        //     method: "GET",
        //     headers: { "Content-Type": "application/json" },
        //   })
        //     .then(async (response) => {
        //       const data = (await response.json()) as PaginatedResponse<User>;
        //       this.setState({
        //         users: data.items,
        //         currentPage: data.currentPage,
        //         totalPages: data.totalPages,
        //       });
        //     })
        //     .catch((_response) => {
        //       this.setState({ users: [] });
        //     });
    }

    render() {
        return <main className="users">
            {this.props.match.params.id}
            {/* <Formik
                validationSchema={this.schema}
                onSubmit={this.submitForm}
                initialValues={this.initialValues}
            >
                {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    values,
                    touched,
                    isValid,
                    errors,
                }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Prénom</Form.Label>
                            <Form.Control
                                id="firstName"
                                type="text"
                                placeholder="Entrez un prénom"
                                value={values.firstName}
                                onChange={(e) => {
                                    this.setState({ formValues: values });
                                    handleChange(e);
                                }}
                                isInvalid={!!errors.firstName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.firstName}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                )}
            </Formik> */}
        </main>
    }
}

export const UserEditWithRouter = withRouter(UserEdit);