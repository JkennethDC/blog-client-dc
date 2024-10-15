import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'notyf/notyf.min.css'
import { Container } from "react-bootstrap";

import { UserProvider } from "./context/UserContext";

// Pages and Components
import AppNavbar from "./components/AppNavbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import User from "./pages/User";
import Blogs from "./pages/Blogs"
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";

export default function App() {

    const [user, setUser] = useState({
        id: null,
        username: null,
        isAdmin: false
    });

    function unsetUser() {
        localStorage.clear()
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res) => {
            const data = res.data;

            if(data.auth !== "Failed") {

                setUser({
                    id: data.user._id,
                    username: data.user.username,
                    isAdmin: data.user.isAdmin
                })
            } else {
                setUser({
                    id: null,
                    isAdmin: null
                })
            }
        })
    }, [])


    return (
        <>
            <UserProvider value={{ user, setUser, unsetUser }}>
                <Router>
                <AppNavbar />
                <Container>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/user" element={<User />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/blogs" element={<Blogs />} />
                        <Route path="*" element={<ErrorPage />} />
                    </Routes>
                </Container>
                </Router>
            </UserProvider>
        </>
    )
}