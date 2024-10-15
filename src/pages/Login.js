import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import axios from 'axios';
import 'notyf/notyf.min.css'

export default function Login() {

    const notyf = new Notyf({
        duration: 3000, 
        position: {
            x: 'right', 
            y: 'top'    
        }});

    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const [isActive, setIsActive] = useState(true);


    function authenticate(e) {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
            email: email,
            password: password
        },{
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            const data = res.data;

            if(data.access !== undefined) {
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);

                setEmail('');
                setPassword('');

                notyf.success('You are now logged in')

                if(data.user) {
                    setUser({
                        id: data.user._id,
                        isAdmin: data.user.isAdmin
                    })

                } else {
                    console.error('User  data not found');
                }

            } else if (data.message === "No email found") {
                notyf.error("No email found")

            } else if (data.message === "Email and password do not match") {
                notyf.error("Email and password do not match")
            }
        })
    }

    function retrieveUserDetails(token){
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/details` ,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          const data = res.data;
          
          if (data.user) {
            setUser({
              id: data.user._id,
              isAdmin: data.user.isAdmin
            })
          } else {
            console.error('User  data not found');
          }
        })
      }

    useEffect(() => {

        
        if(email !== '' && password !== ''){
            setIsActive(true);
        }else{
            setIsActive(false);
        }

    }, [email, password]);

    return (    
        (user.id !== null)
        ?
        <Navigate to="/" />
        :
        <div className='d-flex justify-content-center align-items-center vh-100'>
            <Form 
                onSubmit={(e) => {authenticate(e)}} 
                
                className='container p-4 shadow-lg bg-dark border-white text-light rounded'
            >
                <h1 className="my-3 text-center">Login</h1>
                <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant={isActive ? "primary" : "danger"} type="submit" id="loginBtn" disabled={!isActive}>
                    Login
                </Button>
                <p className="text-center mt-3">No account yet? <Link to="/register" style={{ color: '#0d6efd' }}>Sign up</Link> here</p>
            </Form>
        </div>
    );
    
}