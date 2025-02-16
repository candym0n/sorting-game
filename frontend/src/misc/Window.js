import { Container, Card } from "react-bootstrap";

export default function Window({ children }) {
    return (
        <div className="min-h-screen bg-gray-200 p-4">
            <Container className="py-8">
                <Card className=" rounded-xl shadow-lg p-6">
                    {children}
                </Card>
            </Container>
        </div>
    )
}
