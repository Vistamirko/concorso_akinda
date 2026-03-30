 import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Credentials from environment variables
    const VALID_USER = process.env.REACT_APP_USERNAME || "admin";
    const VALID_PASS = process.env.REACT_APP_PASSWORD || "penny2026";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === VALID_USER && password === VALID_PASS) {
            localStorage.setItem("authenticated", "true");
            navigate("/");
        } else {
            setError("Credenziali non valide. Riprova.");
        }
    };

    return (
        <div className="login-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
            <div className="hero-glow"></div>
            <Container style={{ maxWidth: '450px' }}>
                <div className="text-center mb-5">
                    <img 
                        src="/scraper_logo.png" 
                        alt="Logo" 
                        height="80" 
                        className="mb-4"
                        style={{ borderRadius: '15px', filter: 'drop-shadow(0 0 15px rgba(0, 132, 255, 0.4))' }}
                    />
                    <h1 className="h1-premium mb-2">SCRAPER<span style={{ opacity: 0.7 }}>.HUB</span></h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Accedi per gestire i concorsi</p>
                </div>

                <Card className="glass-card shadow-lg p-3">
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4" controlId="formUsername">
                                <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Inserisci username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={{ 
                                        background: 'rgba(255,255,255,0.05)', 
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        padding: '0.8rem'
                                    }}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="formPassword">
                                <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Inserisci password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ 
                                        background: 'rgba(255,255,255,0.05)', 
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        padding: '0.8rem'
                                    }}
                                    required
                                />
                            </Form.Group>

                            {error && <p className="text-danger small mb-3">{error}</p>}

                            <Button 
                                variant="primary" 
                                type="submit" 
                                className="w-100 py-3 mt-2 fw-bold"
                            >
                                ACCEDI ORA
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
                
                <p className="text-center mt-5 small" style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>
                    &copy; 2026 SCRAPER.HUB Enterprise Dashboards
                </p>
            </Container>
        </div>
    );
};

export default Login;
