import Header from "../components/shared/Header";
import { withRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { Container } from "react-bootstrap";

class AllPets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderPets = (pets) => {
    console.log("renderPets " + pets);
    return pets.map((pet) => (
      <li key={pet.id} style={{ fontSize: "20px" }}>
        <Link href={`/pet/${pet._id}`}>
          <a>{pet.name}</a>
        </Link>
      </li>
    ));
  };

  render() {
    const { pets } = this.props;
    return (
      <React.Fragment>
        <Header> </Header>
        <Container>
          <h1>I am Pets Page</h1>
          <ul>{this.renderPets(pets)}</ul>
        </Container>
      </React.Fragment>
    );
  }

  static async getInitialProps() {
    let pets = [];
    console.log("getInitialProps");
    try {
      const PET_SEARCH_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
      const url = `${PET_SEARCH_URI}/api/v1/pets-search/`;
      const res = await axios.get(url);
      console.log(res.data);
      pets = res.data;
    } catch (e) {
      console.log(e);
    }

    return { pets };
  }
}
export default withRouter(AllPets);
