import React from "react";
import axios from "axios";
import Layout from "../../components/shared/Layout.js";

import { withRouter } from "next/router";
import PetMap from "../../components/pet/pet-detail/PetMap";
import PetImageCarousel from "../../components/pet/pet-detail/PetImageCarousel";
import { Col, Container, Row, Button } from "react-bootstrap";
import { Link } from "next/link";

class Pet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static async getInitialProps({ query }) {
    let pet = {};
    if (query.id) {
      //console.log(query.id);
    }
    try {
      const PET_SEARCH_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
      const url = `${PET_SEARCH_URI}/api/v1/pets-search/${query.id}`;
      const res = await axios.get(url);
      //console.log(res.data);
      pet = res.data;
    } catch (e) {
      console.log(e);
    }

    return { pet };
  }

  handleSearchByCity = (pet) => {
    const { router } = this.props;
    router.push({
      pathname: "/pet-search-results",
      query: { type: "city_state", q: `${pet.city}_${pet.state}` },
    });
  };

  render() {
    const { pet } = this.props;

    return (
      <Layout
        content={
          <React.Fragment>
            <Container>
              <section id="petDetails">
                <div className="title-section">
                  <div className="row">
                    <div className="col-md-6">
                      <h1>{pet.name}</h1>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6"></div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <a
                        href="#"
                        onClick={(pet) => this.handleSearchByCity(pet)}
                      >
                        {pet.city}, {pet.state}
                      </a>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6"></div>
                  </div>
                </div>
              </section>

              <section id="petDetails">
                <div className="upper-section">
                  <div className="row">
                    <div className="col-md-6">
                      <style>
                        {`.custom-tag {
              height: 300px;
              background: black;
            }`}
                      </style>
                      <PetImageCarousel pet={pet} className="custom-tag" />
                    </div>

                    <div className="d-none col-md-6 d-md-block">
                      <PetMap
                        location={`${pet.street},${pet.city},${pet.state}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <div className="row">
                    <div className="col-md-8">
                      <h2>ID: {pet._id}</h2>
                      <p>{pet.species}</p>
                      <p>{pet.description}</p>
                      <h1>Owner: {pet.owner.fullname}</h1>
                    </div>
                    <div className="col-md-4"> </div>
                  </div>
                </div>
              </section>
            </Container>
          </React.Fragment>
        }
      />
    );
  }
}

export default withRouter(Pet);
