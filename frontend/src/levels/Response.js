import { useEffect, useState } from 'react';
import { ProgressBar, Button, Container, Form, Row, Col} from 'react-bootstrap';

export default function Response({ completed, canProceed, reason, correct, explanation, tryAgain }) {
    let [now, setNow] = useState(100);

    const continueSection = () => {
        setNow(100);
        tryAgain();
    }

    useEffect(() => {
        if (correct) return void setNow(0);

        const id = setInterval(() => {
            setNow(a=>a - 2);
        }, 100);

        return () => clearInterval(id);
    },  [correct])

    return (
        <Container>
            <Form.Group className="text-center">
                <Form.Label style={{ fontSize: "2.5rem", color: correct ? "green" : "red" }}>{reason}</Form.Label>
                <Row className="introduction justify-content-center" style={{ fontSize: "1.2rem" }}>
                    <Col xs={10} md={8} lg={6}>
                        <div>
                            {explanation}
                        </div>
                        <Button disabled={now > 0 || canProceed} onClick={continueSection} variant={correct ? "success" : "danger"} style={{display: completed ? "none" : ""}}>
                            Continue
                            <ProgressBar style={{display: now > 0 ? "flex" : "none"}} now={now} />
                        </Button>
                    </Col>
                </Row>
            </Form.Group>
        </Container>
    );
}
