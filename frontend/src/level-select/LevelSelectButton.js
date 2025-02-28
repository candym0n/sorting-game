import { Row, Col, Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Lock, Star } from "lucide-react";
import Auth from "../auth/AuthContext";
import { useContext } from "react";

export default function LevelSelectButton({ index }) {
    const { data } = useContext(Auth.Context);

    const levelData = data.levelData.find(a => a.id == index);
    const locked = index != 1 && !levelData;

    const renderStars = (count) => {
        const stars = [];
        for (let i = 0; i < 3; i++) {
            if (i < count) {
                stars.push(
                    <Col>
                        <Star
                            key={i}
                            className="w-100 h-100"
                            fill="yellow"
                            strokeWidth={1}
                        />
                    </Col>
                );
            } else {
                stars.push(
                    <Col>
                        <Star
                            key={i}
                            className="w-100 h-100"
                        />
                    </Col>
                );
            }
        }
        return stars;
    };

    return (
        <OverlayTrigger placement="top" overlay={<Tooltip>{levelData?.name}</Tooltip>}>
            <Col className="justify-content-md-center">
                <Row className="justify-content-md-center">
                    <Button
                        disabled={locked}
                        className="position-relative level-select-button"
                        as={Link}
                        to={`/level/${index}`}
                    >
                        {
                            locked ? <Lock style={{ width: "50%", height: "50%" }} /> :
                                <span>{index}</span>
                        }
                    </Button>
                </Row>
                {!locked && <Row className="justify-content-md-center">
                    <Col />
                    {renderStars(levelData?.score)}
                    <Col />
                </Row>}
            </Col>
        </OverlayTrigger>
    )
}
