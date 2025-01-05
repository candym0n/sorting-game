import { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { Link } from "react-router";

export default function SignUp() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        let body = JSON.stringify({ password, name });

        fetch("https://localhost:3001/user/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body,
        }).then(response => {
            let data = response.json();
            return data;
        }).then(result => {
            if (result.error) {
                alert(result.error);
            } else if (result.message) {
                alert(result.message || "Success!");
                navigate(`/login?data=` + btoa(body));
            }
        }).catch(error => {
            alert(error.message);
        });
    }

    return (
        <div className="min-h-screen bg-gray-200 p-4">
            <Container className="py-8">
                <Card className="bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-center mb-8">Please sign up</h1>
                    <h6 style={{ color: "grey" }}className="text-center mb-8">Already have an account? <Link to="/login">Log in!</Link></h6>
                    <Form onSubmit={handleSubmit} className="p-5">
                        <Form.Group className="p-3" controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control 
                                type="username" 
                                placeholder="candymanpink" 
                                value={name}
                                onChange={(e) => setName(e.target.value)} 
                            />
                        </Form.Group>
                            <Form.Group className="p-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                        </Form.Group>
                    </Form>
                </Card>
            </Container>
        </div>
    );
}
