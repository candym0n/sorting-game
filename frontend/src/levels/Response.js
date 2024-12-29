import { Button, Container, Form, Row, Col} from 'react-bootstrap';

export default function Response({ reason, correct, explanation }) {
    return (
        <Container>
            <Form.Group className="text-center">
                <Form.Label style={{ fontSize: "2.5rem", color: correct ? "green" : "red" }}>{reason}</Form.Label>
                <Row className="justify-content-center" style={{ fontSize: "1.2rem" }}>
                    <Col xs={10} md={8} lg={6}>
                        <div>
                            {explanation}
                        </div>
                    </Col>
                </Row>
            </Form.Group>
        </Container>
    );
}
