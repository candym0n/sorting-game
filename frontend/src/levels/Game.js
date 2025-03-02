/* eslint-disable react-hooks/exhaustive-deps */
import VisualizerGuess from "./games/VisualizerGuess";
import { Spinner, Button } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react"
import AuthContext from "../auth/AuthContext";
import Introduction from "./Introduction";

const StartingScreen = ({setStarted}) => (
    <div className="min-h-screen bg-gray-200 d-flex align-items-center justify-content-center">
        <div className="text-center">
            <Button onClick={()=>setStarted(true)}>Start</Button>
        </div>
    </div>
);
const LoadingScreen = () => (
    <div className="min-h-screen bg-gray-200 d-flex align-items-center justify-content-center">
        <div className="text-center">
            <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
            <div className="mt-3 text-lg">Loading question...</div>
        </div>
    </div>
);

const ErrorScreen = ({ error, onRetry }) => (
    <div className="min-h-screen bg-gray-200 d-flex align-items-center justify-content-center">
        <div className="text-center">
            <div className="text-danger mb-3">Error loading question: {error}</div>
                <Button variant="primary" onClick={onRetry}>Retry</Button>
            </div>
    </div>
);

const Game = React.memo(function Game({ sectionId, setExplanation, showAnswers, gotCorrect, gotIncorrect, ref, setStarted, started }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [question, setQuestion] = useState(null);
    const [readIntro, setReadIntro] = useState(false);
    const [texts, setTexts] = useState([]);
    const [type, setType] = useState("");
    const [correctList, setCorrectList] = useState([]);

    const fetchData = async () => {
        try {
            setStarted(false);
            setLoading(true);
            setError(null);
            setReadIntro(true); // Don't show introductions right not. Fix this later.
            const response = await fetch(`https://localhost:3001/question/register`, {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: sectionId
                })
            }).then(a=>a.json());
            setQuestion(response[0]);
            setTexts(response[1][0]);
            setType(response[2]);
        } catch(err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    ref.newGame = fetchData;

    useEffect(() => {
        if (texts.length === 0) {
            setReadIntro(true);
        }
    }, [texts]);

    const answer = async (guess) => {
        const result = await fetch("https://localhost:3001/question/answer", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: question.id,
                answer: guess
            })
        }).then(a=>a.json());

        setExplanation(result.explanation);
        setCorrectList(result.result);
        result.correct ? gotCorrect() : gotIncorrect("Incorrect...");
    };

    let mainGame;
    switch (type) {
        case "algo_sound":
            mainGame = 
            <VisualizerGuess 
                question={question}
                showAnswers={showAnswers}
                answer={answer}
                correctList={correctList}
            />
            break;
        default:
            mainGame = "Game not found!";
            break;
    }

    return (
        error ? <ErrorScreen error={error} onRetry={fetchData} /> :
        loading ? <LoadingScreen /> :
        !readIntro ? <Introduction next={()=>setReadIntro(true)} texts={texts} /> :
        !started ? <StartingScreen setStarted={setStarted} /> :
        mainGame
    )
}, (prev, next) => {
    return Object.is(prev.started, next.started) && !next.showAnswers;
});

export default Game;
