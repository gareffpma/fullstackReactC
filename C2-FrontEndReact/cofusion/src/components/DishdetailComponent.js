import React, { Component } from 'react';
import { Row, Button, Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Container, Modal, ModalBody, ModalHeader, Label, FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form'
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';
class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false
        }

        this.toggleModal = this.toggleModal.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    toggleModal() {
        this.setState({
            modalOpen: !this.state.modalOpen
        })
    }
    handleSubmit(values) {
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }

    render() {
        const required = (val) => val && val.length;
        const maxLength = (len) => (val) => !(val) || (val.length <= len);
        const minLength = (len) => (val) => val && (val.length >= len);
        return (
            <>
                <Row>
                    <Button onClick={this.toggleModal}><span className="fa fa-pencil" /> Submit Comment</Button>
                </Row>
                <Modal isOpen={this.state.modalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal} >Submmit Comment</ModalHeader>
                    <ModalBody >
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <FormGroup>
                                <Label htmlFor="ratings">Rating</Label>
                                <Control.select model=".rating" className="custom-select">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Control.select>
                                <Label htmlFor="author">Your Name</Label>
                                <Control.text
                                    model=".author"
                                    className="form-control"
                                    placeholder="Your Name"
                                    validators={{
                                        required, minLength: minLength(3), maxLength: maxLength(15)
                                    }}
                                />
                                <Errors
                                    className="text-danger"
                                    model=".author"
                                    show="touched"
                                    messages={{
                                        required: 'Required',
                                        minLength: 'Must be greater than 3 characters',
                                        maxLength: 'Must be 15 characters or less'
                                    }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlfor="comments">Comments</Label>
                                <Control.textarea id="message" name="message" className="form-control" model=".comments" rows="6" />
                            </FormGroup>
                            <FormGroup>
                                <Button type="submit" className="bt-primary">Submit</Button>
                            </FormGroup>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </>
        );
    }
}

function RenderDish({ dish }) {
    if (dish != null) {
        return (
            <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
            <Card>
                <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
            </FadeTransform>
        );
    } else {
        return (
            <div></div>
        )
    }
}

function RenderComments({comments, postComment, dishId}) {
    if (comments != null) {
        const comm = comments.map(commentdish => {
            //  let cdate=new Date(commentdish.date)
            return (
                <Fade in>
                <li>
                    <p>{commentdish.comment}</p>
                    <p>-- {commentdish.author} , {/*cdate.toDateString()*/}
                        {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(commentdish.date)))} </p>
                </li>
                </Fade>
            );
        });

        return (
            <div>
                <h4>Comments</h4>
                <ul className="list-unstyled">
                <Stagger in>
                    {comm}
                    <CommentForm dishId={dishId} postComment={postComment} />
                </Stagger>
                </ul>
            </div>
        )
    } else {
        return (
            <div>nada</div>
        )
    }
}
const DishDetail = (props) => {
                
    if (props.isLoading) {
        return(
            <div className="container">
                <div className="row">            
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.errMess) {
        return(
            <div className="container">
                <div className="row">            
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }
    return (
        <Container>
            <div className="row">
                <Breadcrumb>

                    <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                    <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>{props.dish.name}</h3>
                    <hr />
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-md-5 m-1">
                    <RenderDish dish={props.dish} />
                </div>
                <div className="col-12 col-md-5 m-1">
                <RenderComments comments={props.comments}
        postComment={props.postComment}
        dishId={props.dish.id}
      />
                </div>
            </div>
        </Container>
    )
}


export default DishDetail;