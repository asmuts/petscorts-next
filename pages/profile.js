import Layout from "../components/shared/Layout.js";
import { useFetchUser } from "../util/user";
import Router from "next/router";

export default function Profile() {
  const { user, loading } = useFetchUser();

  if (loading) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }
  if (!user && !loading) {
    Router.replace("/");
  }

  return (
    <Layout>
      <div>
        <p>Here is your profile information:</p>
        <p>{JSON.stringify(user)}</p>
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      </div>
    </Layout>
  );
}
