import { useRouter } from "next/router";
import { Button } from "react-bootstrap";

const AddPetButton = ({ ownerId }) => {
  const router = useRouter();
  const routeToPetManageForm = (ownerId) => {
    const query = { ownerId: ownerId };
    const url = { pathname: "/pet/managePet", query };
    const asUrl = { pathname: "/pet/managePet", query };
    router.push(url, asUrl);
  };

  return (
    <Button
      variant="outline-primary rounded-pill"
      onClick={() => routeToPetManageForm(ownerId)}
    >
      Add a pet
    </Button>
  );
};

export default AddPetButton;
