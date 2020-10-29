import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import SearchRBT from "./SearchRBT";
import { useFetchUser } from "../../util/user";

const Header = (props) => {
  const router = useRouter();
  const { user, loading } = useFetchUser();

  // refactor, not sure if these will need different treatment
  const handleLogin = () => {
    const query = {};
    const url = { pathname: "/api/login", query };
    const asUrl = { pathname: "/api/login", query };
    router.push(url, asUrl);
  };
  const handleLogout = () => {
    const query = {};
    const url = { pathname: "/api/logout", query };
    const asUrl = { pathname: "/api/logout", query };
    router.push(url, asUrl);
  };
  const handleProfile = () => {
    const query = {};
    const url = { pathname: "/profile", query };
    const asUrl = { pathname: "/profile", query };
    router.push(url, asUrl);
  };
  const handleAccountClick = () => {
    alert("Listing features are not yet implemented.");
  };

  return (
    <div>
      <Head>
        <title>Petscorts - Rent-a-pet</title>
      </Head>

      <Navbar bg="light">
        <div className="d-block d-sm-block">
          <Navbar.Brand onClick={() => router.push("/")}>
            Petscorts
          </Navbar.Brand>
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <SearchRBT props={props} />
          </Nav>
        </Navbar.Collapse>

        <Dropdown id="dropdown-basic-button" title="" align="left">
          <Dropdown.Toggle
            variant="outline-primary"
            id="dropdown-basic"
            className="rounded-pill"
          >
            <i
              className="btn-account fa fa-user-circle mr-sm-2"
              aria-hidden="true"
            ></i>
            Account
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {user && !loading && (
              <>
                <Dropdown.Item onClick={handleLogout} href="#">
                  Logout
                </Dropdown.Item>
                <Dropdown.Item onClick={handleProfile} href="#">
                  Profile
                </Dropdown.Item>
              </>
            )}

            {!user && !loading && (
              <>
                <Dropdown.Item onClick={handleLogin} href="#">
                  Login
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogin} href="#">
                  Sign Up
                </Dropdown.Item>
              </>
            )}
            <Dropdown.Item onClick={handleAccountClick} href="#">
              List your pet
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar>
    </div>
  );
};

export default Header;
