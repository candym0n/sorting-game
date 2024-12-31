import { useEffect } from "react";
import { MAX_VALUE } from "./games/constants";
import Interpreter from "js-interpreter";
import { Col, Row } from "react-bootstrap";
import SortingVisualizer from "./SortingVisualizer";

let audioContext = null;

export default function Sorter({ display, audio, volume, delay, code, list }) {
    useEffect(() => {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return () => {
            if (audioContext) {
                audioContext.close();
            }
        }
    }, []);

    const init = (int, global) => {

    };

    const swap = (a, b, callback) => {
        [list[a], list[b]] = [list[b], list[a]];
        setTimeout(callback, delay);
        playSound(list[a]);
        playSound(list[b]);
    };

    const get = (a) => {
        return list[a];
    };

    const interpreter = new Interpreter(code || "", init);

    const playSound = (height) => {
        if (!audioContext) return;
            
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        const frequency = 200 + (height / MAX_VALUE) * 800;
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    };

    return (
        <SortingVisualizer height={200} list={list} selected={[0, 1]}/>
    );
}
