import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Modal } from "react-bootstrap";
import toast from "toasted-notes";
import { createOption } from "../util/APIUtils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function OptionModal(FieldProps) {
    const [modalState, setModalState] = useState(false);
    const [refreshState, setRefreshState] = useState(false);

    useEffect(() => {
        FieldProps.handleRefresh()
    }, [modalState, refreshState]);

    return (
        <React.Fragment>
            <Button className="btn-sm ml-2 inlineBtn" variant="info" onClick={() => { setModalState(true) }}>
                <FontAwesomeIcon icon={faPlus} /> Option
            </Button>
            <Modal show={modalState} onHide={() => { setModalState(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>New Option</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{ text: '', isCorrect: false }}
                        validate={values => {
                            let errors = {};
                            if (!values.text) {
                                errors.text = 'Option text is required';
                            }
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                                const newOption = {
                                    text: values.text,
                                    isCorrect: values.isCorrect
                                };
                                createOption(newOption, FieldProps.questionId)
                                    .then(res => {
                                        toast.notify("Option created successfully.", { position: "bottom-right" });
                                        setModalState(false);
                                        setRefreshState(true);
                                    }).catch(err => {
                                        toast.notify("Something went wrong!", { position: "bottom-right" });
                                    });
                                setSubmitting(false);
                            }, 400);
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="form-group row text-left">
                                    <label htmlFor="contentTitle" className="col-sm-12 col-form-label">Your <strong>Option</strong></label>
                                    <div className="col-sm-12">
                                        <Field type="text" name="text" id="text" className="form-control" />
                                        <ErrorMessage name="text" component="div" />
                                    </div>
                                </div>
                                <div className="form-group row text-left">
                                    <div className="col-sm-12">
                                        <Field type="checkbox" name="isCorrect" id="isCorrect" /> Is this Correct?
                                    </div>
                                </div>

                                <Button variant="info" type="submit" block disabled={isSubmitting}>Save</Button>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    )
}

export default OptionModal
