import { useEffect, useState } from "react";
import TrueFalse from "./games/TrueFalse";
import Response from "./Response";

function parseTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
  
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(remainingSeconds).padStart(2, '0');
  
    return `${minutesStr}:${secondsStr}`;
}

export default function SectionScreen({ data, setCanProceed }) {
    const [answered, setAnswered] = useState(false);
    const [correct, setCorrect] = useState(false);
    const [message, setMessage] = useState("");
    const [streak, setStreak] = useState(0);
    const [timer, setTimer] = useState(data.limit);

    useEffect(() => {
        if (answered) {
            return;
        }

        const id = setInterval(() => {
            setTimer((prev) => --prev)
        }, 1000);

        return () => clearInterval(id);
    }, [answered]);

    useEffect(() => {
        if (timer <= 0) {
            onIncorrect("Ran out of time...")
        }
    }, [timer]);

    useEffect(() => {
        if (streak >= data.required) setCanProceed(true);
    }, [streak])

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
        setTimer(data.limit)
    }

    return (
        <>
            <div className="mb-4 text-center">
                <h1>{parseTime(timer)}</h1>
                <h3>{streak}/{data.required}</h3>
            </div>
            <div className="mb-4">
                <TrueFalse showAnswers={answered} gotCorrect={onCorrect} gotIncorrect={onIncorrect}/>
            </div>
            {
            answered && <>
                <hr className="my-4"></hr>
                <div className="mb-4">
                    <Response completed={streak >= data.required} tryAgain={tryAgain} correct={correct} reason={correct ? "Correct!" : message} explanation={data.description} />
                </div>
            </>
            }
        </>
    );
}
