import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const { regInfo, updateRegInfo, regUser, regError, isRegLoading } = useContext(AuthContext);
  return (
    <Form onSubmit={regUser}>
      <Row
        style={{
          height: "100vh",
          justifyContent: "center",
          paddingTop: "15%",
        }}
      >
        <Col xs={5}>
          <Stack gap="3">
            <h2 className="mb-3">Register</h2>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              onChange={(e) =>
                updateRegInfo({ ...regInfo, name: e.target.value })
              }
            />
            <Form.Control
              type="email"
              placeholder="Enter your Email"
              onChange={(e) =>
                updateRegInfo({ ...regInfo, email: e.target.value })
              }
            />
            <Form.Control
              type="password"
              placeholder="Enter a Password"
              onChange={(e) =>
                updateRegInfo({ ...regInfo, password: e.target.value })
              }
            />
            <Button variant="warning" type="submit">
              {isRegLoading ? "Registering..." : "Register User"}
            </Button>
            { regError?.error && (
              <Alert variant="danger">
                <p>{ regError?.message }</p>
              </Alert>
            )}
          </Stack>
        </Col>
      </Row>
    </Form>
  );
}

export default Register;
