import React from "react";
import axios from "axios";
import Layout from "../../components/shared/Layout.js";
import { Container } from "react-bootstrap";

import { withRouter } from "next/router";
//import PetDetailMapRight from "../../components/pet/pet-detail/PetDetailMapRight";
import PetDetailMapBottom from "../../components/pet/pet-detail/PetDetailMapBottom";

class Pet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // TODO switch this over to use react-query
  static async getInitialProps({ query }) {
    let pet = {};
    if (query.id) {
      console.log(query.id);
    }
    const PET_SEARCH_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
    const url = `${PET_SEARCH_URI}/api/v1/pets-search/${query.id}`;
    try {
      const res = await axios.get(url);
      //console.log(res.data);
      pet = res.data;
    } catch (e) {
      console.log(e, `Error calling ${url}`);
    }

    return { pet };
  }

  render() {
    const { pet } = this.props;
    return (
      <Layout>
        <section id="petDetail">
          <PetDetailMapBottom pet={pet} />
        </section>
      </Layout>
    );
  }
}

export default withRouter(Pet);
