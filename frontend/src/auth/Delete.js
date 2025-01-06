import { useState, useEffect } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function SignOut() {
    const [deleted, setDeleted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://localhost:3001/user/get-data", {
            credentials: "include"
        }).then(result=>{
            setDeleted(!result.ok);
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("https://localhost:3001/user/delete", {
            method: "DELETE",
            credentials: "include"
        }).then(() => {
            navigate(0);
        });
    }

    return (
        <div className="min-h-screen bg-gray-200 p-4">
            <Container className="py-8">
                <Card className="bg-white rounded-xl shadow-lg p-6">
                    <Card.Header>
                        <Button variant="outline-primary" as={Link} to="/level-select"><ArrowLeft /></Button>
                    </Card.Header>
                    <h1 className="text-3xl font-bold text-center mb-8">{deleted ? "You HAVE no account to delete" : "Are you sure you want to delete your entire account - an irreversible action that will ruin your entire life?????"} </h1>
                    {
                        deleted ?
                        (
                            <Form onSubmit={e=>void e.preventDefault()} className="d-flex justify-content-center p-5">
                                <Button as={Link} to="/login" variant="primary" type="submit">
                                    Log in
                                </Button>
                            </Form>
                        ) :
                        (
                            <Form onSubmit={handleSubmit} className="d-flex justify-content-center p-5">
                                <Button variant="primary" type="submit">
                                    Yes
                                </Button>
                            </Form>
                        )
                    }
                </Card>
            </Container>
        </div>
    );
}
