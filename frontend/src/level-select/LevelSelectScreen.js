import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import LevelSelect from "./LevelSelect";

const LoadingScreen = () => (
    <div className="min-h-screen bg-gray-200 d-flex align-items-center justify-content-center">
        <div className="text-center">
            <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
            <div className="mt-3 text-lg">Loading Levels...</div>
        </div>
    </div>
);

const ErrorScreen = ({ error, onRetry }) => (
    <div className="min-h-screen bg-gray-200 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="text-danger mb-3">Error loading levels: {error}</div>
        <Button variant="primary" onClick={onRetry}>Retry</Button>
      </div>
    </div>
  );

export default function LevelSelectScreen() {
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLevels = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("http://localhost:3001/get-levels");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setLevels(data.map(a=>({
                name: a.name,
                index: a.level_index
            })));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchLevels();
    }, []);

    if (loading) {
        return <LoadingScreen />
    } else if (error) {
        return <ErrorScreen error={error} onRetry={fetchLevels}></ErrorScreen>
    }

    return <LevelSelect levels={levels}></LevelSelect>
}
