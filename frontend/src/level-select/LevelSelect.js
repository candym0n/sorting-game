import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router";
import LevelSelectButton from "./LevelSelectButton";
import Auth from "../auth/AuthContext";
import { LogInIcon, LogOutIcon, DeleteIcon, PlusCircleIcon } from "lucide-react";
import { useContext, useEffect } from "react";
import Login from "../auth/Login";

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
            <div style={{ position: "absolute", right: 10, top: 10 }}>
                {
                    !data.logged_in ? (
                        <>
                            <Link to="/login">
                                <LogInIcon size={100} />
                            </Link>
                            <Link to="/signup">
                                <PlusCircleIcon size={100} />
                            </Link>
                        </>) : (
                        <>
                            <Link to="/delete-account">
                                <DeleteIcon color="red" size={10} />
                            </Link>
                            <Link to="/signout">
                                <LogOutIcon size={100} />
                            </Link>
                        </>
                    )

                }
            </div>
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
