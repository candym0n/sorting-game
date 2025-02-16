import { useState, useEffect, useContext } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { Link, useSearchParams } from "react-router";
import { useNavigate } from "react-router";
import Auth from "./AuthContext";
import { ArrowLeft } from "lucide-react";
import Window from "../misc/Window";

export default function Login() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const dataParam = searchParams.get('data');
    const navigate = useNavigate();
    const {data, setData, concatUnique} = useContext(Auth.Context);

    useEffect(() => {
        if (!dataParam) return;
        try {
            const decoded = JSON.parse(atob(dataParam));
            setName(decoded.name);
            setPassword(decoded.password);
            
            handleSubmit();
        } catch(err) {
            
        }
    }, []);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        const body = JSON.stringify({ name, password, data });
        fetch("https://localhost:3001/user/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body,
            credentials: "include"
        }).then(response => {
            let data = response.json();
            return data;
        }).then(result => {
            if (result.error) {
                alert(result.error);
            } else if (result.name) {
                alert("Welcome back, " + result.name + "!");
                setData({
                    logged_in: true,
                    name: result.name,
                    data: {
                        lastLevel: Math.max(result.data?.lastLevel, data.lastLevel),
                        seen: concatUnique(data.data?.seen, result.data?.seen)
                    }
                });
                navigate("/level-select");
            } else {
                console.log(result);
            }
        }).catch(error => {
            alert(error.message);
        });
    }

    return (
        <Window>
            <Card.Header>
                <Button variant="outline-primary" as={Link} to="/level-select"><ArrowLeft /></Button>
            </Card.Header>
            <h1 className="introduction text-3xl font-bold text-center mb-8">Please log in</h1>
            <h6 style={{ color: "grey" }}className="introduction text-center mb-8">Don't have an account? <Link className="introduction-link" to="/signup">Sign up now!</Link></h6>
            <Form onSubmit={handleSubmit} className="p-5 introduction">
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
        </Window>
    );
}
