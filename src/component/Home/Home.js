import React, {useState} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useNavigate } from 'react-router-dom';

function Home () {
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate("/chat")
    }
    return(
        <>
            <Container>
                <Row>
                    <h1>Welcome</h1>
                </Row>
                <Row>
                    <Col lg={8}></Col>
                    <Col lg={4}>
                        <Button variant="primary" onClick={() => handleNavigate()}>
                        Send
                        </Button>
                    </Col>
                </Row>
            </Container>
            
        </>
    )
}
export default Home;