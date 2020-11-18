import { Modal, Button } from "react-bootstrap";
import React, { useState } from "react";
import { toast } from "react-toastify";

import { archivePet } from "../../../services/ownerPetService";

const ArchivePetModal = ({ pet, informOfChange }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleConfirm = async () => {
    setShow(false);
    await handleArchive(pet._id);
  };
  const handleShow = () => {
    setShow(true);
  };

  const handleArchive = async (petId) => {
    const { pet, err } = await archivePet(petId);
    if (!err) {
      informOfChange();
      toast("Archived pet.");
    }
  };

  ////////////////////////////////////////////////////////////////
  return (
    <>
      <Button variant="outline-danger" size="sm" onClick={handleShow}>
        Archive
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure that you want to archive {pet.name}.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No. Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Yes. Archive
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ArchivePetModal;
