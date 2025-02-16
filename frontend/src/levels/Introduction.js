import React from 'react';
import { Container, Col, Button, Row } from 'react-bootstrap';

export default function Introduction({ next, texts=[] }) {
    return (
      <Container fluid className="justify-content-center d-flex">
        <Row>
          {texts.map((text, i) => (
            <Col className="text-center px-5 introduction" key={"introduction-" + i}>
              <h1>{text.title}</h1>
              <p className="px-5 ">{text.description}</p>
            </Col>
          ))}
          <Row className="px-5">
            <Button onClick={next}variant="primary">
              I got it
            </Button>
          </Row>
        </Row>
      </Container>
    );
};
