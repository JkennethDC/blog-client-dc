import React, { useState, useContext, useEffect } from 'react';
import { Button, Form, Card, Container, Row } from 'react-bootstrap';
import axios from 'axios';
import UserContext from '../context/UserContext';

import Post from '../components/CreatePost';
import BlogList from '../components/BlogList';

export default function Blog() {
    const [showPostModal, setShowPostModal] = useState(false);
    const [posts, setPosts] = useState([]);
    const [query, setQuery] = useState("");
    const [filteredPost, setFilteredPost] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        fetchPosts(); 
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/blogs/getPosts`);
            setPosts(response.data); 
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleShowPostModal = () => setShowPostModal(true);
    const handleClosePostModal = () => setShowPostModal(false);

    const handlePostCreated = (newPost) => {
        setPosts((prevPosts) => [...prevPosts, newPost]);
        handleClosePostModal(); 
    };

    const handleSearch = () => {
        const foundPost = posts.find(post => post.title.toLowerCase() === query.toLowerCase());
        setFilteredPost(foundPost || null); // If no post is found, set to null
    };

    return (
        <div>
            {user.id !== null && user.isAdmin !== true && (
                <Button variant="success" className='m-5' onClick={handleShowPostModal}>
                    Create New Post
                </Button>
            )}

            {showPostModal && (
                <Post showModal={showPostModal} handleClose={handleClosePostModal} onPostCreated={handlePostCreated} />
            )}
        <Container>
            <Row>
                <Card className="p-5 m-3 shadow-lg bg-dark">
            <Form inline className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Search by title"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="mr-sm-2"
                />
                <Button onClick={handleSearch} variant="info" className="my-3">Search</Button>
            </Form>

            {filteredPost ? (
                <Card className="m-5">
                    <Card.Body>
                        <Card.Title>{filteredPost.title}</Card.Title>
                        <Card.Text>{filteredPost.author.username}</Card.Text>
                        <Card.Text>{filteredPost.content}</Card.Text>
                    </Card.Body>
                </Card>
            ) : (
                query && <p>No post found for the title "{query}"</p>
                
            )}
                </Card>
            </Row>
        </Container>

            <BlogList key={posts.length} posts={posts} isAdmin={user.isAdmin} />
        </div>
    );
}
