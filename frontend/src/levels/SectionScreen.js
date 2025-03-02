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

function calculateAverage(prevAverage, newItem, newItemIndex) {
    if (newItemIndex <= 0) {
        return NaN; // Or throw an error, depending on desired behavior
    }

    if (newItemIndex === 1) {
        return newItem;
    }

    return prevAverage + (newItem - prevAverage) / newItemIndex;
}

/**
 * Calculates a score from 0 to 3 (where 0 is F and 3 is A) based on performance metrics
 * @param {Object} params - The performance parameters
 * @param {number} params.incorrectCount - Percentage of questions answered incorrectly (0.0 to 1.0)
 * @param {number} params.meanTime - Average time per correct question in seconds
 * @param {number} params.totalTime - Maximum allowed time per question in seconds
 * @returns {number} - Score from 0 to 3 where 0 is F and 3 is A
 */
function calculateScore(incorrectCount, meanTime, totalTime) {
    // Initialize baseline score components
    let accuracyComponent = 0;
    let timeEfficiencyComponent = 0;
    let timePressureComponent = 0;

    // PART 1: ACCURACY EVALUATION WITH LOGARITHMIC PENALTY
    // Transform incorrectCount through logistic function to create steep penalties for high error rates
    const accuracyBase = 1 - incorrectCount;
    const logisticTransform = 1 / (1 + Math.exp(-12 * (accuracyBase - 0.5)));

    // Apply higher-order polynomial weighting to accuracy
    accuracyComponent = Math.pow(logisticTransform, 1.5) * 1.8;

    // PART 2: TIME EFFICIENCY ANALYSIS WITH EXPONENTIAL DECAY
    // Calculate time efficiency ratio with diminishing returns
    const timeRatio = meanTime / totalTime;

    // Apply sigmoid function to normalize time efficiency between 0 and 1
    // This creates a more nuanced evaluation of time performance
    const sigmoidTimeEfficiency = 1 / (1 + Math.exp(5 * (timeRatio - 0.6)));

    // Weight time efficiency less than accuracy but still significant
    timeEfficiencyComponent = sigmoidTimeEfficiency * 0.8;

    // PART 3: TIME PRESSURE ADAPTATION COEFFICIENT
    // Evaluate how well the user performs under varying time constraints
    // Uses an inverse exponential relationship between mean time and total time
    const timePressureRatio = 1 - Math.exp(-2 * (totalTime - meanTime) / totalTime);
    const adaptationCoefficient = Math.min(1, Math.max(0, timePressureRatio));

    // Apply a complex weighting that rewards efficiency under pressure
    timePressureComponent = adaptationCoefficient * 0.4 * Math.sqrt(accuracyBase);

    // PART 4: INTEGRATED SCORE COMPUTATION WITH DYNAMIC WEIGHTING
    // Base score combines primary components
    let baseScore = accuracyComponent + timeEfficiencyComponent + timePressureComponent;

    // Apply correction factor based on the relationship between accuracy and time
    // This penalizes quick but inaccurate work and rewards careful, correct work
    const correctionFactor = 1 + (0.2 * (Math.pow(accuracyBase, 2) - Math.pow(timeRatio, 0.5)));

    // Apply harmonic balancing to ensure good scores require both accuracy and time efficiency
    const harmonicBalance = 2 * (accuracyComponent * timeEfficiencyComponent) /
        (accuracyComponent + timeEfficiencyComponent + 0.001);

    // Calculate final weighted score with all factors
    let finalScore = baseScore * correctionFactor * (0.7 + 0.3 * harmonicBalance);

    // PART 5: SCORE NORMALIZATION AND BOUNDARY ENFORCEMENT
    // Ensure score is properly bounded between 0 and 3 with smooth transitions
    finalScore = Math.max(0, Math.min(3, finalScore));

    // Apply final non-linear transformation to create appropriate distribution across grade levels
    // This ensures F, D, C, B, A distribution is properly scaled
    const gradeBoundaries = [0, 0.75, 1.5, 2.25, 3];
    const currentBracket = Math.min(3, Math.floor(finalScore / 0.75));
    const progressInBracket = (finalScore - gradeBoundaries[currentBracket]) / 0.75;

    // Apply slight curve to each grade bracket for more nuanced scoring
    const curvedProgressInBracket = Math.pow(progressInBracket, 1.1);
    finalScore = gradeBoundaries[currentBracket] + curvedProgressInBracket * 0.75;
console.log("Incorrect: " + incorrectCount + ", meanTime: " + meanTime + ", totalTime: " + totalTime + " resulted in " + finalScore);
    // Round to no decimal places for cleaner output
    return Math.round(finalScore);
}

export default function SectionScreen({ setScore, sectionData, canProceed, setCanProceed }) {
    const [answered, setAnswered] = useState(false);
    const [correct, setCorrect] = useState(false);
    const [message, setMessage] = useState("");
    const [streak, setStreak] = useState(0);
    const [timer, setTimer] = useState(sectionData.limit);
    const [explanation, setExplanation] = useState("");
    const [started, setStarted] = useState(false);
    const [wrong, setWrong] = useState(0);
    const [meanTime, setMeanTime] = useState(0);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [answeredTime, setAnsweredTime] = useState(sectionData.limit);
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
        if (timer == sectionData.limit) return;
        setAnsweredTime(timer);
    }, [timer]);

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
            setScore(prev => calculateAverage(
                prev,
                calculateScore(wrong / (wrong + sectionData.required), meanTime, sectionData.limit),
                sectionData.index
            ));
            setCanProceed(true);
        } else {
            setCanProceed(false);
        }
    }, [streak])

    useEffect(() => {
    }, [answeredCount]);

    const onCorrect = () => {
        setMeanTime(prev=>calculateAverage(prev, sectionData.limit - answeredTime, answeredCount + 1));
        setAnsweredCount(a => ++a);
        setAnswered(true);
        setCorrect(true);
        setStreak(a => ++a);
    }

    const onIncorrect = (reason) => {
        setAnsweredCount(a => ++a);
        setAnswered(true);
        setCorrect(false);
        setMessage(reason);
        setStreak(0);
        setWrong(a => ++a);
    }

    const tryAgain = () => {
        setAnswered(false);
        setTimer(sectionData.limit);
        if (gameRef) gameRef.newGame();
    }

    return (
        <>
            <div className="mb-4 text-center">
                <h1>{parseTime(timer)}</h1>
                <h3>{streak}/{sectionData.required}</h3>
            </div>
            <div className="mb-4">
                <Game
                    sectionId={sectionData.id}
                    ref={gameRef}
                    setStarted={setStarted}
                    setExplanation={setExplanation}
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
