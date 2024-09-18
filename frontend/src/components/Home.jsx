import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import "./styles.css";
import Consultantform from "./Consultantform";
import Userform from "./Userform";
import Appointments from "./Appointments";
import Pagenotfound from "./Pagenotfound";

const ErrorBoundary = ({ children }) => {
    try {
        return children;
    } catch (error) {
        console.error("Error in route rendering:", error);
        return <Pagenotfound />;
    }
};

const Home = () => {
    return (
        <BrowserRouter> 
            <ErrorBoundary>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/consultant/:email" element={<Consultantform />} />
                    <Route path="/user/:usermail" element={<Userform />} />
                    <Route path="/appointments/:email?" element={<Appointments />} />
                    <Route path="*" element={<Pagenotfound />} />
                </Routes>
            </ErrorBoundary>
        </BrowserRouter>
    );
}

export default Home;
