import { Container, Card, Button, Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SectionScreen from "./SectionScreen";
import Auth from "../auth/AuthContext";
import { ArrowLeft } from "lucide-react";

const LoadingScreen = () => (
    <div className="min-h-screen bg-gray-200 d-flex align-items-center justify-content-center">
        <div className="text-center">
            <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
            <div className="mt-3 text-lg">Loading Section Metadata...</div>
        </div>
    </div>
);

const ErrorScreen = ({ error, onRetry }) => (
    <div className="min-h-screen bg-gray-200 d-flex align-items-center justify-content-center">
        <div className="text-center">
            <div className="text-danger mb-3">Error loading metadata: {error}</div>
            <Button variant="primary" onClick={onRetry}>Retry</Button>
        </div>
    </div>
);

export default function LevelScreen() {
    const { level } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sections, setSections] = useState({});
    const [currentSection, setCurrentSection] = useState(0);
    const [canProceed, setCanProceed] = useState(false);
    const [cheaterCaught, setCheaterCaught] = useState(false);
    const { data, addLevelData } = useContext(Auth.Context);
    const navigate = useNavigate();

    // For calculating the score of this level (changes at the end of every section and written to the database after the last)
    const [score, setScore] = useState(0);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`https://localhost:3001/get-sections?level=${level}`).then(a => a.json());
            setSections(response);
            setCurrentSection(0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const nextSection = () => {
        if (currentSection + 1 >= sections.length) {
            addLevelData(Number(level), score);
            navigate("/level-select");
        } else {
            setCurrentSection(a => ++a);
        }
    }

    if (level != 1 && !data.levelData.some(a => a.index == level)) {
        if (!cheaterCaught) {
            alert("Stop it, cheater. You are only on level " + (data.data?.lastLevel || 1) + "! Catch up!");
            setCheaterCaught(true);
        }
        navigate("/level-select");
        return <></>;
    }
    let mainBody = (
        <div className="bg-gray-200 p-4" style={{ height: "100%" }}>
            <Container className="py-8 h-100">
                <Card>
                    <Card.Header className="d-flex align-items-center">
                        <Button variant="outline-primary" as={Link} to="/level-select" className="me-auto">
                            <ArrowLeft />
                        </Button>
                        <h1 className="text-3xl text-center flex-grow font-bold mb-8">
                            Section {level}.{currentSection + 1}
                        </h1>
                    </Card.Header>
                    <Card.Body>
                        <SectionScreen
                            canProceed={canProceed}
                            setCanProceed={setCanProceed}
                            sectionData={sections[currentSection]}
                            setScore={setScore}
                        />
                    </Card.Body>
                    <Card.Footer>
                        <Button onClick={nextSection} disabled={!canProceed} style={{ width: "100%" }}>Next Section</Button>
                    </Card.Footer>
                </Card>
            </Container>
        </div>
    );

    return error ? <ErrorScreen error={error} onRetry={fetch} /> :
        loading ? <LoadingScreen /> :
            mainBody;
}
