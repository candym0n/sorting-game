import React, { useEffect, useState, useRef } from "react";
import { ARRAY_LENGTH, MAX_VALUE } from "./games/constants";
import Interpreter from "js-interpreter";
import { Form, Button, Col, Row } from "react-bootstrap";
import { PauseCircle, PlayCircle } from "lucide-react";
import SortingVisualizer from "./SortingVisualizer";

let audioContext = null;

export default function Sorter({ display, audio, code }) {
    const [interpreter, setInterpreter] = useState(null);
    const [selected, setSelected] = useState([]);
    const [volume, setVolume] = useState(0.5);
    const [delay, setDelay] = useState(20);
    const [play, setPlay] = useState(false);
    const [list, setList] = useState([]);
    const listRef = useRef(list);
    const volumeRef = useRef(volume);

    useEffect(() => {
        listRef.current = list;
    }, [list]);

    useEffect(() => {
        volumeRef.current = volume;
    }, [volume]);

    useEffect(() => {
        setList([]);
        for (let i = 0; i < ARRAY_LENGTH; ++i) setList(a=>[...a, (1 - i / ARRAY_LENGTH) * MAX_VALUE]);

        for (let i = 0; i < ARRAY_LENGTH; ++i) {
            setList(prev => {
                let randomIndex = Math.floor(Math.random() * ARRAY_LENGTH);
                [prev[randomIndex], prev[i]] = [prev[i], prev[randomIndex]];
                return prev;
            });
        }
    }, []);


    useEffect(() => {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return () => {
            if (audioContext) {
                audioContext.close();
            }
        }
    }, []);
    const swap = (a, b, callback) => {
        if (a > list.length || b > list.length || a < 0 || b < 0) return void callback();
        setList(prev=>{
            let copy = [...prev]
            let prevA = copy[a];
            copy[a] = prev[b];
            copy[b] = prevA;

            return copy;
        });
        setSelected([a, b]);
        playSound((a+b)/2)
        setTimeout(callback, 1);
    };

    const getList = (a) => {
        return listRef.current[a];
    }

    const get = (a) => {
        return getList(a)
    };

    const length = () => {
        return list.length;
    };

    const debug = (msg) => {
        console.log(msg);
    }

    useEffect(() => {
        if (interpreter || !list.length) return;
    
        const init = (int, global) => {
            int.setProperty(global, 'length', int.createNativeFunction(length));
            int.setProperty(global, "get", int.createNativeFunction(get));
            int.setProperty(global, "swap", int.createAsyncFunction(swap));
            int.setProperty(global, "debug", int.createNativeFunction(debug));
        };

        setInterpreter(new Interpreter(code || "", init));
    }, [list]);
    const nextStep = async (token, play) => {
        while (1) {
            if (token.stop) {
                return;
            }
            else if (!play) {
                await new Promise(res=>setTimeout(res, 500));
                continue;
            }
            let goOn = false;
            await interpreter.step();
            switch (interpreter.getStatus()) {
                case Interpreter.Status.DONE:
                    token.stop = true;
                    return void console.log("YES");
                case Interpreter.Status.ASYNC:
                    await new Promise(res=>setTimeout(res, delay));
                    goOn = true;
                    break;
                default:
                    break;
            }
            if (goOn) continue;
        }
    }

    useEffect(() => {
        if (!interpreter) return;
        let token = {};
        nextStep(token, play);
        return () => {
            token.stop = true;
            return;
        }
    }, [delay, play]);

    const playSound = (height) => {
        if (!audioContext) return;
        if (!height) return;
        if (volumeRef.current < 0.02) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        const frequency = 200 + (height / MAX_VALUE) * 800;
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = "triangle";

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volumeRef.current, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    };

    return (
        <>
            {display && <SortingVisualizer height={200} list={list} selected={selected}/>}
            <Form.Group>
                <Row>
                    <Col>
                        <Form.Label style={{ fontSize: "1.5rem" }}>Volume: {Math.floor(100 * volume)}%</Form.Label>
                        <Form.Range min={0} max={1} step={0.01} onChange={(e)=>setVolume(e.target.value)}/>
                    </Col>
                    <Col>
                        <Form.Label style={{ fontSize: "1.5rem" }}>Delay: {Math.floor(delay) / 1000}s</Form.Label>
                        <Form.Range defaultValue={20} min={1} max={1000} step={10} onChange={(e)=>setDelay(e.target.value)}/>
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
        </>
    );
}
