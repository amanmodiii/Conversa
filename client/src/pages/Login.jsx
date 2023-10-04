import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { loginUser,
          updateLoginInfo,
          loginInfo,
          loginError,
          isLoginLoading } = useContext(AuthContext);

  return (
    <Form onSubmit={loginUser}>
      <Row
        style={{
          height: "100vh",
          justifyContent: "center",
          paddingTop: "15%",
        }}
      >
        <Col xs={5}>
          <Stack gap="3">
            <h2 className="mb-3">Login</h2>
            <Form.Control
              type="email"
              placeholder="Enter your Email"
              onChange={(event) =>
                updateLoginInfo({
                  ...loginInfo,
                  email: event.target.value,
                })
              }
            />
            <Form.Control
              type="password"
              placeholder="Enter a Password"
              onChange={(event) =>
                updateLoginInfo({
                  ...loginInfo,
                  password: event.target.value,
                })
              }
            />
            <Button variant="warning" type="submit">
              {isLoginLoading ? "Logging in..." : "Log In"}
            </Button>

            {loginError?.error && (
              <Alert variant="danger">
                <p>{loginError?.message}</p>
              </Alert>
            )}
          </Stack>
        </Col>
      </Row>
    </Form>
  );
}

export default Login;
