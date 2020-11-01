import React, { Component, createContext } from "react";
import Layout from "../../components/shared/Layout.js";
import axios from "axios";

import CreatePetForm from "../../components/pet/manage/CreatePetForm";

class EditPet extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { ownerId } = this.props;
    return (
      <Layout>
        <CreatePetForm ownerId={ownerId}></CreatePetForm>
      </Layout>
    );
  }

  // get pet if an id is supplied
  // otherwise it's an add pet
  static async getInitialProps({ query }) {
    let ownerId = query.ownerId;
    console.log("ownerId = " + ownerId);
    // let pet = {};
    // if (query.petId) {
    //   console.log(query.id);
    // }
    // const PET_SEARCH_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
    // const url = `${PET_SEARCH_URI}/api/v1/pets/${query.id}`;
    // try {
    //   const res = await axios.get(url);
    //   //console.log(res.data);
    //   pet = res.data;
    // } catch (e) {
    //   console.log(e, `Error calling ${url}`);
    // }

    // return { pet };
    return { ownerId };
  }
}

export default EditPet;
