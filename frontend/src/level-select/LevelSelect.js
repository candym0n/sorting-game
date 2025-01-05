import { Container, Row, Card, Col } from "react-bootstrap";
import { Link } from "react-router";
import LevelSelectButton from "./LevelSelectButton";
import Auth from "../auth/AuthContext";
import { useContext } from "react";

export default function LevelSelect({ levels }) {
    const { data, setData } = useContext(Auth.Context);

    console.log(data)

    return (
        <div className="min-h-screen bg-gray-200 p-4">
            <Container className="py-8">
                <Card className="bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-center mb-8">Select Level</h1>
                    <h5 style={{ color: "grey" }}className="text-center mb-8">{
                        data.logged_in ?
                            "Welcome back, " + data.name + "!":
                            <Link style={{zIndex: 1000, position: "relative"}} to="/login">Log in now</Link>
                        }</h5>
                    <h6 style={{ color: "grey" }}className="text-center mb-8">{data.logged_in && 
                        <>
                            <Link to="/signout" style={{zIndex: 1001, position: "relative"}}>Sign out </Link>
                            or
                            <Link to="/delete-account" style={{zIndex: 1000, color: "red", position: "relative"}}> delete account</Link>
                        </>
                    }</h6>
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
