import Header from "../../components/shared/Header";
import { Container } from "react-bootstrap";
import { UserProvider, useFetchUser } from "../../util/user";

function Layout({ children }) {
  const { user, loading } = useFetchUser();

  return (
    <UserProvider value={{ user, loading }}>
      <div>
        <Header> </Header>
        <main>
          <Container className="main-container">{children}</Container>
        </main>
      </div>
    </UserProvider>
  );
}

export default Layout;
