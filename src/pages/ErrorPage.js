import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap'; 

const ErrorPage = () => {
    const navigate = useNavigate(); 

    const handleHomeRedirect = () => {
        navigate('/'); 
    };

    return (
        <div className="text-center" style={{ marginTop: '50px' }}>
            <h1>Oops! Something went wrong.</h1>
            <p>We couldn't find the page you're looking for.</p>
            <Button variant="primary" onClick={handleHomeRedirect}>
                Go to Home
            </Button>
        </div>
    );
};

export default ErrorPage;