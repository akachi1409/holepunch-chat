import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import React, {useState} from "react"
import "./App.css";
import b4a from "b4a";
import DHT from "@hyperswarm/dht-relay";
import Stream from "@hyperswarm/dht-relay/ws";
import Hyperswarm from "hyperswarm";

const ws = new WebSocket("wss://dht2-relay.leet.ar");
const dht = new DHT(new Stream(true, ws));
// DHT ...
const swarm = new Hyperswarm({ dht }); // you pass it as an option
swarm.on("connection", function (socket, info) {
  console.log("new swarm connection");
  socket.on("data", function (data) {
    console.log("data from peer", b4a.toString(data));
  });

  // setInterval(() => {
  //   socket.write('hello: ' + Date.now())
  // }, 1000)
  // socket.write('hello')
  // socket.end()
});

const topic = b4a.alloc(32).fill("game-room-001");
swarm.join(topic);

function App() {
  const [msg, setMsg] = useState("");
  return (
    <div className="App">
      <Container>
        <Row>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Chat history</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
            
          </Form>
        </Row>
        <Row>
          <Col lg = {9}>
              <Form.Control type="text" placeholder="name@example.com" value={msg} onChange={(e)=>setMsg(e.target.value)} />
            </Col>
            <Col lg = {3}>
              <Button variant="primary">Send</Button>
            </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
