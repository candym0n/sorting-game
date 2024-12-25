import { Button, Col, Form, Container, Row } from "react-bootstrap";

export default function TrueFalse() {
    return (
        <Container>
            <Form.Group controlId="formBasicCheckbox">
                <Form.Label style={{ fontSize: "1.5rem" }}>Is this sentence a lie?</Form.Label>
                <Row>
                    <Col>
                        <Button variant="outline-primary" size="lg" className="rounded-pill w-100">
                            True
                        </Button>
                    </Col>
                    <Col>
                        <Button variant="outline-primary" size="lg" className="rounded-pill w-100">
                            False
                        </Button>
                    </Col>
                </Row>
            </Form.Group>
        </Container>
    );
}
