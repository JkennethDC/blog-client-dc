import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBTypography } from 'mdb-react-ui-kit';
import axios from 'axios';

import UserContext from '../context/UserContext';

export default function User(){
    const notyf = new Notyf({
        duration: 4000,
        position: {
            x: 'right',
            y: 'top'
        }
    });

    const { user } = useContext(UserContext);
   
    const [details,setDetails] = useState({});
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const url = user.isAdmin === true ? `${process.env.REACT_APP_API_BASE_URL}/users/allUser ` : `${process.env.REACT_APP_API_BASE_URL}/users/details`;
        
        axios.get(url, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res) => {
            const data = res.data
        
            if (data.user && data.user.hasOwnProperty("_id")) {
            setDetails(data.user);

            } else if (data.users) { 
            setAllUsers(data.users);

            } else if (data.user && data.user.error === "User  not found") {
            notyf.error("User  not found.");

            } else {
            notyf.error("Something went wrong, kindly contact us for assistance.")
            }
        });
    }, [user.isAdmin])




    return (
        (user.id === null) ? (
            <Navigate to="/register" />
        ) : (
            <section className="" style={{ backgroundColor: '#f4f5f7' }}>
            <MDBContainer className="py-5 h-100"> 
                <h1 className='text-center m-5'>User's information</h1>
                <MDBRow className="justify-content-center align-items-center h-100">
                {(user.isAdmin === true) ? (
                    <MDBCol lg="12" className="mb-4 mb-lg-0">
                    <MDBRow className="justify-content-center align-items-center">
                        {allUsers.map((user, index) => (
                        <MDBCol key={index} lg="4" className="mb-4 mb-lg-0">
                            <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                            <MDBRow className="g-0 justify-content-center align-items-center">
                                <MDBCol md="4" className="gradient-custom text-center"
                                style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                                <MDBTypography tag="h5">{user.username}</MDBTypography>
                                <MDBCardText className={user.IsAdmin ? 'd-block' : 'd-none'}>
                                    Admin
                                </MDBCardText>
                                </MDBCol>
                                <MDBCol md="8">
                                <MDBCardBody className="p-4">
                                    <MDBTypography tag="h6">Information</MDBTypography>
                                    <hr className="mt-0 mb-4" />
                                    <MDBRow className="pt-1">
                                    <MDBCol size="8" className="mb-3">
                                        <MDBTypography tag="h6">Email</MDBTypography>
                                        <MDBCardText className="text-muted">{user.email}</MDBCardText>
                                    </MDBCol>
                                    </MDBRow>
                                </MDBCardBody>
                                </MDBCol>
                            </MDBRow>
                            </MDBCard>
                        </MDBCol>
                        ))}
                    </MDBRow>
                    </MDBCol>
                ) : (
                    <MDBCol lg="6" className="mb-4 mb-lg-0">
                    <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                        <MDBRow className="g-0 justify-content-center align-items-center">
                        <MDBCol md="4" className="gradient-custom text-center"
                            style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                            <MDBTypography tag="h5">{details.username}</MDBTypography>
                            <MDBCardText className={details.IsAdmin ? 'd-block' : 'd-none'}>
                            Admin
                            </MDBCardText>
                        </MDBCol>
                        <MDBCol md="8">
                            <MDBCardBody className="p-4">
                            <MDBTypography tag="h6">Information</MDBTypography>
                            <hr className="mt-0 mb-4" />
                            <MDBRow className="pt-1">
                                <MDBCol size="8" className="mb-3">
                                <MDBTypography tag="h6">Email</MDBTypography>
                                <MDBCardText className="text-muted">{details.email}</MDBCardText>
                                </MDBCol>
                            </MDBRow>
                            </MDBCardBody>
                        </MDBCol>
                        </MDBRow>
                    </MDBCard>
                    </MDBCol>
                )}
                </MDBRow>
            </MDBContainer>
            </section>
        )
    );
     

}