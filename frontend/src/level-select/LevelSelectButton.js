import { Button, Col, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Lock } from "lucide-react";

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

export default function LevelSelectButton({ locked, index, name }) {
    return (
        <OverlayTrigger trigger="hover" placement="top" overlay={<Tooltip>{name}</Tooltip>}>
            <span>
                <Button style={buttonStyle} variant={locked ? "secondary" : "primary"} disabled={locked} className="position-relative">
                        {index}
                        {locked && <Lock className="position-absolute" style={{
                            bottom: "10%",
                            right: "10%",
                            width: "20%",
                            height: "20%"
                        }} />}
                </Button>
            </span>
        </OverlayTrigger>
    )
}
