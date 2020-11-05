import { withRouter } from "next/router";
import axios from "axios";
import { Col, Container, Row } from "react-bootstrap";

import Layout from "../components/shared/Layout.js";
import PetListing from "../components/pet/pet-listing/PetListing";
import PetSearchMap from "../components/pet/pet-listing/PetSearchMap";

class PetSearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    //console.log("constructor called");
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
    //console.log("renderEmptyResults called");
    return (
      <section id="petSearchResults">
        <div style={{ height: "400px", width: "400px" }}>
          <PetSearchMap {...this.props} />
        </div>
      </section>
    );
  };

  render() {
    const { pets, message, title } = this.props;
    return (
      <Layout>
        <section id="petSearchResults">
          <Row>
            <Col className="col-md-12">
              <p className="page-title">{title}</p>
            </Col>{" "}
          </Row>
          <div>{this.renderPets(pets, message)}</div>
        </section>
      </Layout>
    );
  }

  //-------------------------------------------
  // GET THE DATA
  // TODO clean this up.
  static async getInitialProps({ query }) {
    //console.log("getInitialProps " + query.q);

    let pets = await PetSearchResults.searchForPets(query);

    // TODO fix messaging
    const message = PetSearchResults.createMessage(query, pets);

    const title = PetSearchResults.createTitle(query, pets);

    // Later, when searching by geoLocation, I'll need to reverse lookup the city.
    // data for centering map if needed.
    let cities = await PetSearchResults.getCityData(query);

    return { pets, cityData: cities, message, title };
  }

  static createTitle(query, pets) {
    let title = "";
    if (pets.length === 0) return title;

    // determine type of serch
    if (query.type === "nearby") {
      title = "Pets near you";
    } else {
      const { city } = PetSearchResults.getCityAndStateFromQuery(query);
      title = `Pets in ${city} and nearby`;
    }
    return title;
  }

  static createMessage(query, pets) {
    let message = "";
    const { city } = PetSearchResults.getCityAndStateFromQuery(query);
    if (pets.length === 0) {
      let cityMessage = "";
      if (city) {
        cityMessage = `in ${city} or`;
      }
      message = `Sorry. There are no pets for rent ${cityMessage} nearby.`;
    }
    return message;
  }

  static async getCityData(query) {
    let cities = {};
    const { city, state } = PetSearchResults.getCityAndStateFromQuery(query);
    if (city === null || city === "") return cities;

    const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;
    let cityDataApiRoute = `/api/v1/cities/name/${city}/state/${state}`;
    const cityDataUrl = baseURL + cityDataApiRoute;
    try {
      const res = await axios.get(cityDataUrl);
      if (res.status === 200) {
        cities = res.data;
      }
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
      if (res.status === 200) {
        pets = res.data;
      }
    } catch (e) {
      console.log(e);
      //TODO handle error
    }
    return pets;
  }

  // build a query based on the query type
  static getSearchUrlFromRequest(query) {
    const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;

    //console.log(`query = ${query}`);
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
    if (city) {
      city = city.charAt(0).toUpperCase() + city.slice(1);
    }
    return { city, state };
  }
}

export default withRouter(PetSearchResults);
