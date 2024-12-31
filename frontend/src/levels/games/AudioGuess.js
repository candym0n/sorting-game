import Sorter from "../Sorter";
import { Container, Form, Col, Row, Button} from "react-bootstrap";

export default function AudioGuess({ data, algoData, showAnswers, gotCorrect, gotIncorrect }) {
    const answer = ({ target }) => {
        if (target.ariaLabel == data[1]) gotCorrect();
        else gotIncorrect("Incorrect...");
    };
    
    return (
        <Container>
            <Sorter 
                code={algoData.implementation}
                audio display
            />
            <Form.Group className="mt-5">
                <Col>
                    <Row>
                        <Col className="d-flex align-items-end flex-column">
                            <Button disabled={showAnswers} aria-label={0} onClick={answer} variant={showAnswers ? (data[1] == 0 ? "success" : "danger") : "primary"} className="w-50">{data[0][0].name}</Button>
                        </Col>
                        <Col className="d-flex align-items-start flex-column">
                            <Button disabled={showAnswers} aria-label={1} onClick={answer} variant={showAnswers ? (data[1] == 1 ? "success" : "danger") : "primary"} className="w-50">{data[0][1].name}</Button>
                        </Col>
                    </Row>
                    <Row>
                        <br/>
                    </Row>
                    <Row>
                        <Col className="d-flex align-items-end flex-column">
                            <Button disabled={showAnswers} aria-label={2} onClick={answer} variant={showAnswers ? (data[1] == 2 ? "success" : "danger") : "primary"} className="w-50">{data[0][2].name}</Button>
                        </Col>
                        <Col className="d-flex align-items-start flex-column">
                            <Button disabled={showAnswers} aria-label={3} onClick={answer} variant={showAnswers ? (data[1] == 3 ? "success" : "danger") : "primary"} className="w-50">{data[0][3].name}</Button>
                        </Col>
                    </Row>
                </Col>
            </Form.Group>
        </Container>
    );
}
