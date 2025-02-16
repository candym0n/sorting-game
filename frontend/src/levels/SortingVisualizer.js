import { MAX_VALUE } from "./games/constants";
import { Container, Row, Col } from 'react-bootstrap';

export default function SortingVisualizer({ list = [], height, selected = [] }) {
    return (
      <Container fluid>
          <Row className="align-items-end justify-content-start" style={{ height: `${height + 20}px` }}>
              {list.map((value, index) => (
                    <Col 
                        key={"visualize-" + index} 
                        style={{padding:0}}
                    >
                        <div
                            style={{
                                height: `${(value / MAX_VALUE) * height}px`,
                                backgroundColor: selected.includes(index) ? '#00AA00' : '#00EE00',
                                width: '100%'
                            }}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};
