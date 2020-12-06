import { Card, Button } from "react-bootstrap";
import { useRouter } from "next/router";

//import useUserData from "../../../hooks/useUserData";
import { useFetchUser } from "../../../util/user";
import { useOwnerForAuth0Sub } from "../../../hooks/useOwnerData";

// Display an edit link if the user is the owner
const EditPetCardFooter = ({ pet }) => {
  const router = useRouter();

  //const { user, isLoading: isUserLoading } = useUserData();
  const { user, loading: isUserLoading } = useFetchUser();
  const {
    owner,
    isLoading: isOwnerLoading,
    isError: isOwnerError,
  } = useOwnerForAuth0Sub(user);

  if (isUserLoading || isOwnerLoading) {
    return "";
  }

  // console.log(owner);
  // console.log(pet);

  const routeToPetManageForm = (petId) => {
    const query = { petId: petId };
    push(query, "/pet/managePet");
  };
  const push = (query, path) => {
    const url = { pathname: path, query };
    const asUrl = { pathname: path, query };
    router.push(url, asUrl);
  };

  if (!pet || !owner) {
    return "";
  }

  return (
    <>
      {owner && pet.owner === owner._id && (
        <Card.Footer>
          {" "}
          <Button
            variant="outline-primary rounded-pill"
            onClick={() => routeToPetManageForm(pet._id)}
          >
            Manage pet
          </Button>
        </Card.Footer>
      )}
    </>
  );
};

export default EditPetCardFooter;
