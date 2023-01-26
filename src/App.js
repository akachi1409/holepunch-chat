import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useState, useEffect } from "react"
import "./App.css";
import b4a from "b4a";
import DHT from "@hyperswarm/dht-relay";
import Stream from "@hyperswarm/dht-relay/ws";
import Hyperswarm from "hyperswarm";

const ws = new WebSocket("wss://dht2-relay.leet.ar");
const dht = new DHT(new Stream(true, ws));
const swarm = new Hyperswarm({ dht });

function App() {
  const [msg, setMsg] = useState("");
  const [history, setHistory] = useState(["Start of message"])

  useEffect(() => {
    console.log('new swarm')

    swarm.on('connection', onsocket)

    const topic = b4a.alloc(32).fill("game-room-002"); // + custom room name, prefix + hash it
    swarm.join(topic)

    function onsocket (socket, info) {
      console.log('new peer connected')

      socket.on('error', (err) => console.error('socket error', err.code))
      socket.on('close', () => console.log('peer disconnected'))

      socket.on('data', function (data) {
        console.log('new message from peer:', b4a.toString(data));
        addToHistory(b4a.toString(data));
      })
    }

    return () => {
      swarm.destroy()
      swarm.off('connection', onsocket)
    }
  }, [])

  console.log('new app render')

  const addToHistory = (message) => {
    const temp = [...history];
    temp.push(message);
    setHistory(temp)
  }

  const handlePushMsg = () => {
    if (!msg) return

    if (swarm.connections.size === 0) {
      setMsg("");
      return
    }

    console.log('sending message to', swarm.connections.size, 'peers:', msg);

    addToHistory(msg);

    for (const socket of swarm.connections) {
      socket.write(msg);
    }

    setMsg("");
  }

  return (
    <div className="App">
      <Container>
        <ListGroup variant="flush">
        {
          history.map((item, index)=>(
            <ListGroup.Item key={index}>{item}</ListGroup.Item>
          ))
        }
        </ListGroup>
        <Row>
          <Col lg = {9}>
              <Form.Control type="text" placeholder="sample message" value={msg} onChange={(e)=>setMsg(e.target.value)} />
            </Col>
            <Col lg = {3}>
              <Button variant="primary" onClick={()=> handlePushMsg()}>Send</Button>
            </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;