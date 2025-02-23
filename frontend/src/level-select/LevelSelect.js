import { Row, Col } from "react-bootstrap";
import { Link } from "react-router";
import LevelSelectButton from "./LevelSelectButton";
import Auth from "../auth/AuthContext";
import { LogInIcon, LogOutIcon, DeleteIcon } from "lucide-react";
import { useContext, useEffect } from "react";

export default function LevelSelect({ levels }) {
    const { data, setData } = useContext(Auth.Context);

    useEffect(() => {
        const prevent = e => {
            if (!data.logged_in) e.preventDefault();
        };

        window.addEventListener("beforeunload", prevent);
        return () => window.removeEventListener("beforeunload", prevent);
    }, [data]);

    const titleStyle = {
        color: "orange",
        fontSize: "100px"
    }

    return (
        <>
            <h1 style={titleStyle} className="text-center">Level Select</h1>
            <Row className="g-4 p-5">
                {levels.map((level) => (
                    <Col key={"level-select-" + level.index} sm={3} md={3} lg={2}>
                        <LevelSelectButton key={"level-select-" + level} index={level.index} name={level.name} />
                    </Col>
                ))}
            </Row>
        </>
    );
}
