import { Container, Row, Card, Col } from "react-bootstrap";
import { useParams } from "react-router";

export default function SectionScreen() {
    const { level, section } = useParams();
    return (
        <div className="min-h-screen bg-gray-200 p-4">
            <Container className="py-8">
                <Card className="bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-center mb-8">Section {level}.{section}</h1>
                    
                </Card>
            </Container>
        </div>
    );
}
