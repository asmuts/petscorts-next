import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { reActivatePet } from "../../../hooks/ownerPetService";

const ReactivatePetButton = ({ petId, informOfChange }) => {
  const handleReActivate = async (petId) => {
    const { pet, err } = await reActivatePet(petId);
    if (!err) {
      informOfChange();
      toast("Re-activation is not yet implemented.");
    }
  };

  return (
    <Button
      variant="outline-success rounded"
      size="sm"
      onClick={() => handleReActivate(petId)}
    >
      Re-Activate
    </Button>
  );
};

export default ReactivatePetButton;
