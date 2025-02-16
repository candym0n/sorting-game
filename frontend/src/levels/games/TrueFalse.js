import { Button, Col, Form, Container, Row } from "react-bootstrap";

export default function TrueFalse({ showAnswers, gotCorrect, gotIncorrect }) {
    return (
        <Container>
            <Form.Group>
                <Form.Label style={{ fontSize: "1.5rem" }}>Is this sentence a lie?</Form.Label>
                <Row>
                    <Col>
                        <Button disabled={showAnswers} variant={showAnswers ? "success" : "outline-primary"} size="lg" className="rounded-pill w-100" onClick={gotCorrect}>
                            True
                        </Button>
                    </Col>
                    <Col>
                        <Button disabled={showAnswers} variant={showAnswers ? "danger" : "outline-primary"} size="lg" className="rounded-pill w-100" onClick={() => gotIncorrect("Incorrect!")}>
                            False
                        </Button>
                    </Col>
                </Row>
            </Form.Group>
        </Container>
    );
}
