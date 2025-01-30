import Sorter from "../Sorter";
import { Container, Form, Col, Row, Button} from "react-bootstrap";

export default function VisualizerGuess({ question, showAnswers, answer, correctList }) {
    const answerQuestion = ({ target }) => answer(target.ariaLabel)

    return (
        <Container>
            <Sorter 
                code={question.implementation}
                audio display
            />
            <Form.Group className="mt-5">
                <Col>
                    <Row>
                        {question.answers[0] && (
                            <Col className="d-flex align-items-end flex-column">
                                <Button disabled={showAnswers} aria-label="0" onClick={answerQuestion} variant={showAnswers ? (correctList[0] ? "success" : "danger") : "primary"} className="w-50">{question.answers[0]}</Button>
                            </Col>
                        )}
                        {question.answers[1] && (
                            <Col className="d-flex align-items-start flex-column">
                                <Button disabled={showAnswers} aria-label="1" onClick={answerQuestion} variant={showAnswers ? (correctList[1] ? "success" : "danger") : "primary"} className="w-50">{question.answers[1]}</Button>
                            </Col>
                        )}
                    </Row>
                    <Row>
                        <br/>
                    </Row>
                    <Row>
                        {question.answers[2] && (
                            <Col className={"d-flex flex-column " + (!!question.answers[3] ? "align-items-end" : "align-items-center")}>
                                <Button disabled={showAnswers} aria-label="2" onClick={answerQuestion} variant={showAnswers ? (correctList[2] ? "success" : "danger") : "primary"} className="w-50">{question.answers[2]}</Button>
                            </Col>
                        )}
                        {question.answers[3] && (
                            <Col className="d-flex align-items-start flex-column">
                                <Button disabled={showAnswers} aria-label="3" onClick={answerQuestion} variant={showAnswers ? (correctList[3] ? "success" : "danger") : "primary"} className="w-50">{question.answers[3]}</Button>
                            </Col>
                        )}
                    </Row>
                </Col>
            </Form.Group>
        </Container>
    );
}
