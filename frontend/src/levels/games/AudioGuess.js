import Sorter from "../Sorter";
import { useState, useEffect } from "react";
import { Container, Form, Col, Row, Button} from "react-bootstrap";
import { PlayCircle, PauseCircle } from "lucide-react";
import { MAX_VALUE } from "./constants";

export default function AudioGuess({ data, showAnswers, gotCorrect, gotIncorrect }) {
    const [volume, setVolume] = useState(0.5);
    const [delay, setDelay] = useState(200);
    const [list, setList] = useState([]);
    const [play, setPlay] = useState(false);

    useEffect(() => {
        for (let i = 0; i < 100; ++i) setList(a=>[...a,Math.random() * MAX_VALUE]);
    }, [])

    const answer = ({ target }) => {
        if (target.ariaLabel == data[1]) gotCorrect();
        else gotIncorrect("Incorrect...");
    };

    return (
        <Container>
            <Sorter list={list} code={data.implementation} delay={delay} volume={volume} display audio></Sorter>
            <Form.Group>
                <Row>
                    <Col>
                        <Form.Label style={{ fontSize: "1.5rem" }}>Volume: {Math.floor(100 * volume)}%</Form.Label>
                        <Form.Range min={0} max={1} step={0.01} onChange={(e)=>setVolume(e.target.value)}/>
                    </Col>
                    <Col>
                        <Form.Label style={{ fontSize: "1.5rem" }}>Delay: {Math.floor(delay) / 1000}s</Form.Label>
                        <Form.Range min={100} max={1000} step={10} onChange={(e)=>setDelay(e.target.value)}/>
                    </Col>
                    <Col>
                        <Row xs={3}>
                            <br />
                        </Row>
                        <Row xs={1}>
                            <Button className="w-100" variant="primary" onClick={()=>setPlay(a=>!a)}>
                                {play ? "Pause " : "Play "}
                                {play ? <PauseCircle /> : <PlayCircle /> }
                            </Button>
                        </Row>
                    </Col>
                </Row>
            </Form.Group>
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
