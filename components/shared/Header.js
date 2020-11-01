import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import SearchRBT from "./SearchRBT";
import { useFetchUser } from "../../util/user";

const Header = (props) => {
  const router = useRouter();
  const { user, loading } = useFetchUser();

  const handleProfile = () => {
    push({}, "/profile");
  };
  const handleListPet = () => {
    push({}, "/manage/owner");
  };
  const push = (query, path) => {
    const url = { pathname: path, query };
    const asUrl = { pathname: path, query };
    router.push(url, asUrl);
  };

  return (
    <div>
      <Head>
        <title>Petscorts - Rent-a-pet</title>
      </Head>

      <Navbar bg="light fixed-top">
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
                <Dropdown.Item href="/api/auth/logout">Logout</Dropdown.Item>
                <Dropdown.Item onClick={handleProfile} href="#">
                  Profile
                </Dropdown.Item>
                <hr />
                <Dropdown.Item onClick={handleListPet} href="#">
                  List your pet
                </Dropdown.Item>
              </>
            )}

            {!user && !loading && (
              <>
                <Dropdown.Item href="/api/auth/login">Login</Dropdown.Item>
                <Dropdown.Item href="/api/auth/signup">Sign Up</Dropdown.Item>
                <hr />
                <Dropdown.Item href="/api/auth/login-owner">
                  List your pet
                </Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </Navbar>
    </div>
  );
};

export default Header;
