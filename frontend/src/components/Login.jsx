import { useState, useEffect } from "react";
import "./styles.css";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { motion, useAnimation } from "framer-motion";
import { backend_server } from '../constants';

const Login = () => {
    const controls = useAnimation();

    useEffect(() => {
        controls.start({ x: 0, y: 0, opacity: 1, transition: { duration: 0.5 } });
    }, [controls]);

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [redirect, setRedirect] = useState("");
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('jwtoken') !== null;
        if (isAuthenticated) {
            setAuthenticated(true);
        }
    }, []);

    const onsubmit = async (event) => {
        event.preventDefault();
        console.log('Submitting login form with:', { name, password, email }); // Debugging output

        try {
            const response = await axios.post(`${backend_server}/`, {
                name: name,
                password: password,
                email: email,
            });
            console.log('Response from server:', response.data); // Debugging output

            if (response.data.token) {
                localStorage.setItem('jwtoken', response.data.token);

                if (response.data.user.role === "consultant" || response.data.user.role === "user") {
                    setRedirect(response.data.user.role);
                    setAuthenticated(true);
                }
            }
        } catch (err) {
            console.error('Error during login:', err.message); // More detailed error logging
            if (err.response) {
                console.error('Response error data:', err.response.data);
                console.error('Response error status:', err.response.status);
            } else if (err.request) {
                console.error('Request error data:', err.request);
            } else {
                console.error('Error message:', err.message);
            }
        }
    }

    if (authenticated) {
        if (redirect === "consultant") {
            return <Navigate to={`/consultant/${email}`} />;
        } else if (redirect === "user") {
            return <Navigate to={`/user/${email}`} />;
        }
    }

    return (
        <div className="container">
            <div className="signin-signup">
                <form onSubmit={onsubmit}>
                    <h2 className="title">Sign in</h2>
                    <motion.div className="input-field" whileHover={{ scale: 1.2 }} animate={controls} initial={{ x: -500 }}>
                        <i className="fas fa-user"></i>
                        <input type="text" placeholder="Username" name="name" onChange={(e) => { setName(e.target.value) }} required />
                    </motion.div>
                    <motion.div className="input-field" whileHover={{ scale: 1.2 }} animate={controls} initial={{ x: -500 }}>
                        <i className="fas fa-envelope"></i> {/* Updated icon for email */}
                        <input type="email" placeholder="Email" name="email" onChange={(e) => { setEmail(e.target.value) }} required /> {/* Updated name attribute */}
                    </motion.div>
                    <motion.div className="input-field" whileHover={{ scale: 1.2 }} animate={controls} initial={{ x: 500 }}>
                        <i className="fas fa-lock"></i>
                        <input type="password" placeholder="Password" name="password" onChange={(e) => { setPassword(e.target.value) }} required />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.2 }} animate={controls} initial={{ y: 500 }}><input type="submit" value="Login" className="btn" /></motion.div>
                    <p style={{ color: "white" }}>Don't have an account? <Link to="/signup" className="link" style={{ cursor: 'pointer' }}>Sign up</Link></p>
                </form>
            </div>
        </div>
    );
}

export default Login;
