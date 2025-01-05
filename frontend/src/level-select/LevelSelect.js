import { Container, Row, Card, Col } from "react-bootstrap";
import LevelSelectButton from "./LevelSelectButton";

export default function LevelSelect({ levels }) {
    return (
        <div className="min-h-screen bg-gray-200 p-4">
            <Container className="py-8">
                <Card className="bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-center mb-8">Select Level</h1>
                    <Row className="g-4 p-5">
                        {levels.map((level) => (
                            <Col key={"level-select-" + level.index} xs={6} sm={3} md={3} lg={2}>
                                <LevelSelectButton key={"level-select-" + level} index={level.index} name={level.name} />
                            </Col>
                        ))}
                    </Row>
                </Card>
            </Container>
        </div>
    );
}
