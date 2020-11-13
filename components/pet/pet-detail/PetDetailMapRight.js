import PetMap from "./PetMap";
import PetImageCarousel from "./PetImageCarousel";
import { Container } from "react-bootstrap";
import { useRouter } from "next/router";

// This can be deleted soon.  I don't plan on using it.
const PetDetailMapRight = ({ pet }) => {
  const router = useRouter();

  const handleSearchByCity = () => {
    const query = { type: "city_state", q: `${pet.city},${pet.state}` };
    const url = { pathname: "/pets", query };
    const asUrl = { pathname: "/pets", query };
    router.push(url, asUrl);
  };

  return (
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
                <a href="#" onClick={handleSearchByCity}>
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
                  height="300"
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
  );
};

export default PetDetailMapRight;
