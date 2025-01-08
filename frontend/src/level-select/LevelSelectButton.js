import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import Auth from "../auth/AuthContext";
import { useContext } from "react";

const buttonStyle = {
    aspectRatio: "1/1",
    width: "100%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    fontSize: "max(4vw, 2.5rem)",
    fontWeight: "bold",
    lineHeight: 1,
};

export default function LevelSelectButton({ index, name }) {
    const { data, setData } = useContext(Auth.Context);
    
    const locked = ((data.data?.lastLevel || 0) + 1) < index;

    return (
        <OverlayTrigger placement="top" overlay={<Tooltip>{name}</Tooltip>}>
            <Button 
                style={buttonStyle}
                variant={locked ? "secondary" : "primary"}
                disabled={locked}
                className="position-relative shine"
                as={Link}
                to={`/level/${index}`}
            >
                    {index}
                    {locked && <Lock className="position-absolute" style={{
                        bottom: "10%",
                        right: "10%",
                        width: "20%",
                        height: "20%"
                    }} />}
            </Button>
        </OverlayTrigger>
    )
}
