import { withRouter } from "next/router";
import axios from "axios";
import Layout from "../components/shared/Layout.js";
import { Col, Container, Row } from "react-bootstrap";
import PetListing from "../components/pet/pet-listing/PetListing";
import PetSearchMap from "./../components/pet/pet-listing/PetSearchMap";

class PetSearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    console.log("constructor called");
  }

  // TODO move all the display logic into a sfc
  renderPets = (pets, message) => {
    return (
      <div>
        {message !== "" && <h3>{message}</h3>}
        {pets.length === 0 && this.renderEmptyResults(message)}
        {pets.length > 0 && (
          <Container id="petSearchResults">
            <Row>
              <Col>
                <PetListing pets={pets} />
              </Col>{" "}
              <Col className="d-none d-md-block">
                <PetSearchMap pets={pets} {...this.props} />
              </Col>{" "}
            </Row>
          </Container>
        )}
      </div>
    );
  };

  renderEmptyResults = (message) => {
    console.log("renderEmptyResults called");
    return (
      <Container id="petSearchResults">
        <div style={{ height: "400px", width: "400px" }}>
          <PetSearchMap {...this.props} />
        </div>
      </Container>
    );
  };

  render() {
    const { pets, message } = this.props;
    return (
      <Layout>
        <React.Fragment>
          <Row>
            <Col className="col-md-6">
              <h1>Pet Search Results</h1>
            </Col>{" "}
          </Row>
          <div>{this.renderPets(pets, message)}</div>
        </React.Fragment>
      </Layout>
    );
  }

  //-------------------------------------------
  // GET THE DATA
  // TODO clean this up.
  static async getInitialProps({ query }) {
    console.log("getInitialProps " + query.q);

    // TODO fix messaging
    let message = "";

    // if (query.q === null || query.q === "") {
    //   message =
    //     "Try searching for a city. Until then . . .<p/> Here are some of our pets.";
    // }

    let pets = await PetSearchResults.searchForPets(query);

    const { city } = PetSearchResults.getCityAndStateFromQuery(query);
    if (pets.length === 0) {
      message = `Sorry. There are no pets for rent in ${city} or nearby.`;
    }

    // Later, when searching by geoLocation, I'll need to reverse lookup the city.
    // data for centering map if needed
    let cities = await PetSearchResults.getCityData(query);

    return { pets, cityData: cities, message };
  }

  static async getCityData(query) {
    let cities = {};
    const { city, state } = PetSearchResults.getCityAndStateFromQuery(query);
    if (city === null || city === "") return cities;

    const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;
    let cityDataApiRoute = `/api/v1/cities/name/${city}/state/${state}`;
    const cityDataUrl = baseURL + cityDataApiRoute;
    try {
      const resCityData = await axios.get(cityDataUrl);
      console.log("City data: " + resCityData.data);
      cities = resCityData.data;
    } catch (e) {
      console.log(e, `Error calling ${cityDataUrl}`);
      //TODO handle error
    }
    return cities;
  }

  static async searchForPets(query) {
    const searchUrl = PetSearchResults.getSearchUrlFromRequest(query);

    let pets = {};
    try {
      const res = await axios.get(searchUrl);
      console.log("res.data = " + res.data);
      pets = res.data;
    } catch (e) {
      console.log(e);
      //TODO handle error
    }
    return pets;
  }

  // build a query based on the query type
  static getSearchUrlFromRequest(query) {
    const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;

    console.log(`query = ${query}`);
    let apiRoute = `/api/v1/pets-search/`;
    if (query.type && query.type === "nearby") {
      // I should have the lat and lng for the usr
      // I could try an IP lookup
      // or I could just disable the button.
      const lat = query.lat; //"41.8668662"; //41.8668662
      const lng = query.lng; //"-71.38392180000001"; //-71.38392180000001
      apiRoute = `/api/v1/pets-search/geo/lat/${lat}/lng/${lng}?meters=7000`;
    } else if (query.type && query.type === "city_state") {
      const { city, state } = PetSearchResults.getCityAndStateFromQuery(query);
      if (city !== "" && state !== "") {
        apiRoute = `/api/v1/pets-search/near/city/${city}/state/${state}`;
      }
    }

    return baseURL + apiRoute;
  }

  static getCityAndStateFromQuery(query) {
    let city = "";
    let state = "";
    if (query.q && query.q !== null && query.q !== "") {
      if (query.q.split(",").length >= 2) {
        city = query.q.split(",")[0];
        state = query.q.split(",")[1].trim();
      }
    }
    return { city, state };
  }
}

export default withRouter(PetSearchResults);
