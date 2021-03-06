import Head from "./Head";
import NavBar from "./NavBar";
import { Container } from "react-bootstrap";
import { UserProvider, useFetchUser } from "../../util/user";
import { ToastContainer } from "react-toastify";
//import 'react-toastify/dist/ReactToastify.css';
import "react-toastify/dist/ReactToastify.min.css";

function Layout({ children }) {
  const { user, loading } = useFetchUser();

  return (
    <UserProvider value={{ user, loading }}>
      <div>
        <Head></Head>
        <NavBar> </NavBar>
        <ToastContainer />
        <main>
          <Container className="main-container">{children}</Container>
        </main>
      </div>
    </UserProvider>
  );
}

export default Layout;
