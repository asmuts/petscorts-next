import { Modal, Button } from "react-bootstrap";
import React, { useState } from "react";
import { toast } from "react-toastify";
import http from "../../../services/authHttpService";

const ArchivePetModal = ({ pet, markStale }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleConfirm = async () => {
    setShow(false);
    await handleArchive(pet._id);
    markStale();
  };
  const handleShow = () => {
    setShow(true);
  };

  const handleArchive = async (petId) => {
    const PET_SEARCH_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
    const url = `${PET_SEARCH_URI}/api/v1/pets/${petId}`;
    try {
      const res = await http.delete(url);
      if (res.status === 200) {
        pet = res.data;
        console.log("Archived pet.");
        toast("Archived pet.");
        markDataStale();
      }
      // TODO handle error
    } catch (e) {
      console.log(e, `Error calling ${url}`);
    }
  };

  ////////////////////////////////////////////////////////////////
  return (
    <>
      <Button variant="danger" size="sm" onClick={handleShow}>
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
