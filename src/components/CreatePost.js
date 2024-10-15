import { Modal, Button, Form } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { Notyf } from 'notyf';
import axios from 'axios';
import UserContext from '../context/UserContext';

export default function Post({ showModal, handleClose, onPostCreated }) { 
    const [newPost, setNewPost] = useState({
        title: '',
        content: '',
        author: ''
    });
    const notyf = new Notyf({
        duration: 4000,
        x: 'top',
        y: 'right'
    });

    const user = useContext(UserContext);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost((prevPost) => ({ ...prevPost, [name]: value }));
    };

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const userDetails = response.data;
            setNewPost((prevPost) => ({ ...prevPost, author: userDetails.username || userDetails.id }));
        } catch (error) {
            notyf.error('Failed to fetch user details');
            console.error('Error fetching user details:', error);
        }
    };

    const createPost = async () => {
        await fetchUserDetails();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/blogs/post`, {
                title: newPost.title,
                content: newPost.content,
                author: user.id
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const createdPost = response.data; 
            onPostCreated(createdPost);
            handleClose(); 
            setNewPost({ title: '', content: '', author: '' }); 
            notyf.success("Post Created")
        } catch (error) {
            notyf.error('Failed to create post');
            console.error('Error creating post:', error);
        }
    };

    const handleCreatePost = async () => {
        await createPost();
    };

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create a new post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={newPost.title}
                            onChange={handleInputChange}
                            placeholder="Enter title"
                        />
                    </Form.Group>
                    <Form.Group controlId="content">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="content"
                            value={newPost.content}
                            onChange={handleInputChange}
                            placeholder="Enter content"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleCreatePost}>
                    Create Post
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}