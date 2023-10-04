import { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap"
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Notification from "./chat/Notification";

export default function NavBar() {
  const { user, logOutUser } = useContext(AuthContext);
  return (
    <Navbar bg="dark" className="mb-4" style={{ height: "4rem" }}>
      <Container>
        <Link to="/" className="link-light text-decoration-none">
          <h2>CONVERSA</h2>
        </Link>
        {user && (
          <span className="text-warning">Logged in as {user?.name}</span>
        )}
        <Nav>
          <Stack direction="horizontal" gap="4">
            {!user ? (
              <>
                <Link to="/login" className="link-light text-decoration-none">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="link-light text-decoration-none"
                >
                  Register
                </Link>
              </>
            ) : (<>
              <Notification />
              <Link
                to="/login"
                onClick={() => logOutUser()}
                className="link-light text-decoration-none"
              >
                Logout
              </Link>
            </>)}
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
}
