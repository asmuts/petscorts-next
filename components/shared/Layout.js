import Header from "../../components/shared/Header";

function Layout(props) {
  return (
    <div>
      <Header> </Header>
      <main>{props.content}</main>
    </div>
  );
}

export default Layout;
