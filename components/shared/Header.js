import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import Search from "./Search";
import SearchRBT from "./SearchRBT";

const handleAccountClick = () => {
  alert("Account features are not yet implemented.");
};

const Header = (props) => {
  const router = useRouter();

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
            <Dropdown.Item onClick={handleAccountClick} href="#/action-1">
              Login
            </Dropdown.Item>
            <Dropdown.Item onClick={handleAccountClick} href="#/action-2">
              Sign Up
            </Dropdown.Item>
            <Dropdown.Item onClick={handleAccountClick} href="#/action-3">
              List your pet
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar>
    </div>
  );
};

export default Header;
