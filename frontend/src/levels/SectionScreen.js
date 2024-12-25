import { Container, Row, Card, Col, Button } from "react-bootstrap";
import { useParams } from "react-router";
import TrueFalse from "./games/TrueFalse";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function SectionScreen() {
    const { level, section } = useParams();
    return (
        <div className="bg-gray-200 p-4" style={{height: "100vh"}}>
            <Container className="py-8 h-100">
                <Card className="bg-white rounded-xl shadow-lg p-6 h-100">
                    <Card.Header>
                        <h1 className="text-3xl font-bold text-center mb-8">Section {level}.{section}</h1>    
                    </Card.Header>
                    <Card.Body>
                        <TrueFalse />
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}
