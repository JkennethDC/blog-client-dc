import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Container, Row, Col, Card, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Notyf } from 'notyf';

export default function BlogList({ posts, isAdmin }) {
    const [blogPosts, setBlogPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState({});
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedPost, setUpdatedPost] = useState({ title: '', content: '' });

    const notyf  = new Notyf({
        duration: 4000,
        position: {
            x: 'top',
            y: 'right'
        }
    });


    useEffect(() => {
        fetchPosts(); 
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/blogs/getPosts`);
            setBlogPosts(response.data); 
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to fetch posts');
        }
    };
    
    const handleShowModal = (post) => {
        setSelectedPost(post);
        setUpdatedPost({ title: post.title, content: post.content });
        setShowModal(true);
    };
    

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setUpdatedPost((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdatePost = async () => {
        try {
            const response = await axios.patch(
                `${process.env.REACT_APP_API_BASE_URL}/blogs/updatePost/${selectedPost._id}`,
                updatedPost,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Update response:', response.data);
            setSelectedPost(null); 
            handleCloseModal(); 
            fetchPosts();
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            const response = await axios.delete(
                `${process.env.REACT_APP_API_BASE_URL}/blogs/deletePost/${postId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            notyf.success("Post Deleted")
            fetchPosts(); 
        } catch (error) {
            console.error('Error deleting post:', error);
            setError('Failed to delete post');
        }
    };

    const handleAddComment = async () => {
        try {
            const comment = {
                userId: localStorage.getItem('token'),
                comment: document.getElementsByName('comment')[0].value,
                blog: selectedPost._id,
                postTitle: selectedPost.title
            };
    
            const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/blogs/addComment/${selectedPost._id}`, comment, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
    
            console.log('Comment added:', response.data); 
            document.getElementsByName('comment')[0].value = ''; 
            fetchPosts();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };
    

    return (
        <Container fluid className="d-flex justify-content-center" style={{ minHeight: '100vh', backgroundImage: 'url()', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
            <Row className="w-100 justify-content-center">
                <Col className='col-lg-8'>
                    <Card className="p-4 shadow-lg bg-dark" style={{ color: 'white', borderRadius: '10px' }}>
                        <Card.Body>
                            <h1 className="text-center mb-4">Blog List</h1>
                            {error ? (
                                <p className="text-center text-danger">{error}</p>
                            ) : (
                                blogPosts.map((post) => (
                                    <div key={post._id} className="card my-5">
                                        <div className="card-body">
                                            <h2 className="card-title">{post.title}</h2>
                                            <p className="card-text">By: {post.author.username}</p>
                                            <p className="card-text">Created At: {new Date(post.createdAt).toLocaleString()}</p>
                                            <h3 className="card-text">{post.content}</h3>
                                            <h5 className="card-text"> Comments: </h5>
                                            {post.comments.map((comment) => (
                                                <p key={comment._id} className="card-text">
                                                {comment.userId.username}: {comment.comments} 
                                                </p>
                                            ))}
                                            <Button variant="primary" onClick={() => handleShowModal(post)}>
                                                Comment
                                            </Button>
                                            {!isAdmin && (
                                                <>
                                                    <Button className='mx-2' variant="secondary" onClick={() => {
                                                        handleShowModal(post);
                                                        setIsEditing(true);
                                                    }}>
                                                        Edit Post
                                                    </Button>
                                                </>
                                            )}
                                                    <Button variant="danger" onClick={() => handleDeletePost(post._id)}>
                                                            Delete Post
                                                    </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Post' : 'Comments for ' + (selectedPost ? selectedPost.title : '')}</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        {isEditing ? (
                            <Form>
                                <Form.Group controlId="title">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={updatedPost.title}
                                        onChange={handleEditChange}
                                        placeholder="Enter title"
                                    />
                                </Form.Group>
                                <Form.Group controlId="content">
                                    <Form.Label>Content</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="content"
                                        value={updatedPost.content}
                                        onChange={handleEditChange}
                                        placeholder="Enter content"
                                    />
                                </Form.Group>
                            </Form>
                        ) : (
                            <div>
                                <Form>
                                    <Form.Group controlId="comment">
                                        <Form.Label>Add a comment</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="comment"
                                            placeholder="Enter your comment"
                                        />
                                    </Form.Group>
                                    <Button className="my-3" variant="primary" onClick={handleAddComment}>
                                        Send
                                    </Button>
                                </Form>
                            </div>
                        )}
                    </Modal.Body>
                <Modal.Footer>
                    {isEditing ? (
                        <>
                            <Button variant="primary" onClick={handleUpdatePost}>
                                Update Post
                            </Button>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                        </>
                    ) : (
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

BlogList.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        author: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
        }).isRequired,
        createdAt: PropTypes.string.isRequired,
    })).isRequired,
    isAdmin: PropTypes.bool.isRequired,
};
