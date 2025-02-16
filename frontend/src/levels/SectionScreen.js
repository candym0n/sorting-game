import { useEffect, useRef, useState } from "react";
import Response from "./Response";
import Game from "./Game";

function parseTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
  
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(remainingSeconds).padStart(2, '0');
  
    return `${minutesStr}:${secondsStr}`;
}

export default function SectionScreen({ sectionData, canProceed, setCanProceed }) {
    const [answered, setAnswered] = useState(false);
    const [correct, setCorrect] = useState(false);
    const [message, setMessage] = useState("");
    const [streak, setStreak] = useState(0);
    const [timer, setTimer] = useState(sectionData.limit);
    const [explanation, setExplanation] = useState("");
    const [started, setStarted] = useState(false);
    let gameRef = useRef({});

    useEffect(() => {
        if (answered || !started) {
            setTimer(sectionData.limit);
            return;
        }

        const id = setInterval(() => {
            setTimer((prev) => --prev);
        }, 1000);

        return () => clearInterval(id);
    }, [answered, sectionData.limit, started]);

    useEffect(() => {
        setStreak(0);
        setStarted(false);
        setAnswered(false);
        gameRef.newGame();
    }, [sectionData]);

    useEffect(() => {
        if (timer <= 0) {
            onIncorrect("Ran out of time...")
        }
    }, [timer]);

    useEffect(() => {
        if (streak >= sectionData.required) {
            setCanProceed(true);
        } else {
            setCanProceed(false);
        }
    }, [sectionData.required, setCanProceed, streak])

    const onCorrect = () => {
        setAnswered(true);
        setCorrect(true);
        setStreak(a=>++a);
    }

    const onIncorrect = (reason) => {
        setAnswered(true);
        setCorrect(false);
        setMessage(reason);
        setStreak(0);
    }

    const tryAgain = () => {
        setAnswered(false);
        setTimer(sectionData.limit);
        if (gameRef) gameRef.newGame();
    }

    return (
        <>
            <div className="introduction mb-4 text-center">
                <h1>{parseTime(timer)}</h1>
                <h3>{streak}/{sectionData.required}</h3>
            </div>
            <div className="mb-4">
                <Game 
                    ref={gameRef} 
                    setStarted={setStarted} 
                    setExplanation={setExplanation} 
                    sectionData={sectionData} showAnswers={answered} 
                    gotCorrect={onCorrect} 
                    gotIncorrect={onIncorrect} 
                    started={started}
                />
            </div>
            {
            answered && <>
                <hr className="my-4"></hr>
                <div className="mb-4">
                    <Response 
                        completed={streak >= sectionData.required} 
                        tryAgain={tryAgain} 
                        correct={correct} 
                        reason={correct ? "Correct!" : message} 
                        explanation={explanation}
                        canProceed={canProceed}
                    />
                </div>
            </>
            }
        </>
    );
}
