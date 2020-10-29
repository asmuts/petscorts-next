import Header from "../../components/shared/Header";

import { UserProvider, useFetchUser } from "../../util/user";

function Layout({ children }) {
  const { user, loading } = useFetchUser();

  return (
    <UserProvider value={{ user, loading }}>
      <div>
        <Header> </Header>
        <main>
          <div className="container">{children}</div>
        </main>
      </div>
    </UserProvider>
  );
}

export default Layout;
