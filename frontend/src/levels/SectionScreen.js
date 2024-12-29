import { useState } from "react";
import TrueFalse from "./games/TrueFalse";
import Response from "./Response";

export default function SectionScreen({ data }) {
    const [answered, setAnswered] = useState(false);
    const [correct, setCorrect] = useState(false);
    const [message, setMessage] = useState("");

    return (
        <>
            <div className="mb-4">
                <TrueFalse />
            </div>
            <hr className="my-4"></hr>
            <div className="mb-4">
                <Response correct reason="Correct!" explanation={data.description}/>
            </div>
        </>
    );
}
