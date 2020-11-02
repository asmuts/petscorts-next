import React from "react";
import Layout from "../../components/shared/Layout.js";
import CreatePetForm from "../../components/pet/manage/CreatePetForm";
import EditPetForm from "../../components/pet/manage/EditPetForm";

class EditPet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { ownerId, petId } = this.props;
    return (
      <Layout>
        <section id="petDetail">
          {ownerId && <CreatePetForm ownerId={ownerId}></CreatePetForm>}
          {petId && <EditPetForm petId={petId}></EditPetForm>}
        </section>
      </Layout>
    );
  }

  // get pet if an id is supplied
  // otherwise it's an add pet
  static async getInitialProps({ query }) {
    let ownerId = query.ownerId;
    let petId = query.petId;
    return { ownerId, petId };
  }
}

export default EditPet;
