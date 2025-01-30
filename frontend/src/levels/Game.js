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

const Game = React.memo(function Game({ setExplanation, sectionData, showAnswers, gotCorrect, gotIncorrect, ref, setStarted, started }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [question, setQuestion] = useState(null);
    const { data, setData } = useContext(AuthContext.Context);
    const [readIntro, setReadIntro] = useState(false);
    const [texts, setTexts] = useState([]);

    const fetchData = async () => {
        try {
            setStarted(false);
            setLoading(true);
            setError(null);
            setReadIntro(false);
            const response = await fetch(`https://localhost:3001/question/register`, {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sorts: sectionData.ids.split(","),
                    type: sectionData.type,
                    seen: data?.data?.seen || []
                })
            }).then(a=>a.json());
            setQuestion(response[0]);
            setTexts(response[1][0]);
            setData(prev => ({
                logged_in: prev.logged_in,
                name: prev.name,
                data: {
                    lastLevel: prev?.data?.lastLevel,
                    seen: [...(prev?.data?.seen || []), ...response[1][1]]
                }
            }))
        } catch(err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    ref.newGame = fetchData;

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (texts.length === 0) {
            setReadIntro(true);
        }
    }, [texts]);

    let mainGame;
    switch (sectionData.type) {
        case "algo_sound":
            mainGame = <VisualizerGuess setExplanation={setExplanation} question={question} showAnswers={showAnswers} gotCorrect={gotCorrect} gotIncorrect={gotIncorrect} />
            break;
        default:
            throw new Error("Cannot find game " + sectionData.type);
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
