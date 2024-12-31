import AudioGuess from "./games/AudioGuess";
import { Spinner, Button } from "react-bootstrap";
import { useState, useEffect, forwardRef, useRef } from "react"

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

export default function Game({ setExplanation, data, showAnswers, gotCorrect, gotIncorrect, ref, setStarted, started }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [gameData, setGameData] = useState(null);
    const [algoData, setAlgoData] = useState(null);

    const fetchData = async () => {
        try {
            setStarted(false);
            setLoading(true);
            setError(null);
            const response = await fetch(`http://localhost:3001/get-random-question?type=${data.type}&include=${data.ids}`).then(a=>a.json());
            setGameData(response[0]);
            const algoResponse = await fetch(`http://localhost:3001/get-sort-data?id=${response[1]}&type=${data.type}`).then(a=>a.json());
            setAlgoData(response[1]);
            console.log(response)
            setExplanation(algoResponse.description);
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

    let mainGame;
    switch (data.type) {
        case "algo_sound":
            mainGame = <AudioGuess data={gameData} showAnswers={showAnswers} gotCorrect={gotCorrect} gotIncorrect={gotIncorrect} />
            break;
        default:
            throw "Cannot find game " + data.type;
    }

    return (
        error ? <ErrorScreen error={error} onRetry={fetchData} /> :
        loading ? <LoadingScreen /> :
        !started ? <StartingScreen setStarted={setStarted} /> :
        mainGame
    )
}
