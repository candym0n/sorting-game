import { Button, Col, Form, Container, Row } from "react-bootstrap";

export default function TrueFalse({ gotCorrect, gotIncorrect }) {
    return (
        <Container>
            <Form.Group>
                <Form.Label style={{ fontSize: "1.5rem" }}>Is this sentence a lie?</Form.Label>
                <Row>
                    <Col>
                        <Button variant="outline-primary" size="lg" className="rounded-pill w-100" onClick={gotCorrect}>
                            True
                        </Button>
                    </Col>
                    <Col>
                        <Button variant="outline-primary" size="lg" className="rounded-pill w-100" onClick={gotIncorrect}>
                            False
                        </Button>
                    </Col>
                </Row>
            </Form.Group>
        </Container>
    );
}
