import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Container, Row, Col } from 'reactstrap';

const appTarget = document.createElement('div');
document.body.appendChild(appTarget);

const root = createRoot(appTarget);

root.render(
  <Container>
    <Row>
      <Col><App/></Col>
    </Row>
    <Row>
      <Col style={{textAlign: 'right'}}>
        <a href="https://github.com/mwthink/crypto-demo"><sub>View on GitHub</sub></a>
      </Col>
    </Row>
  </Container>
)
