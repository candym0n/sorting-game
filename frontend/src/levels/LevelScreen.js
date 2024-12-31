import { Container, Card, Button, Spinner } from "react-bootstrap";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SectionScreen from "./SectionScreen";

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
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`http://localhost:3001/get-sections?level=${level}`).then(a=>a.json());
            setSections(response);
            setCurrentSection(0);
        } catch(err) {
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
            navigate("/level-select")
        } else {
            setCurrentSection(a=>++a);
        }
    }

    let mainBody = (
        <div className="bg-gray-200 p-4" style={{height: "100%"}}>
            <Container className="py-8 h-100">
                <Card className="bg-white rounded-xl shadow-lg p-6 h-100">
                    <Card.Header>
                        <h1 className="text-3xl font-bold text-center mb-8">Section {level}.{currentSection + 1}</h1>    
                    </Card.Header>
                    <Card.Body>
                        <SectionScreen setCanProceed={setCanProceed} data={sections[currentSection]}/>
                    </Card.Body>
                    <Card.Footer>
                        <Button onClick={nextSection} disabled={!canProceed} style={{width:"100%"}}>Next</Button>
                    </Card.Footer>
                </Card>
            </Container>
        </div>
    );

    return error ? <ErrorScreen error={error} onRetry={fetch} /> :
            loading ? <LoadingScreen /> :
            mainBody;
}
