import React from "react";

import { Button } from "../ui/button";
import Modal from "../ui/modal";
import Spinner from "../spinner";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  title: string;
  description: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, isPending, title, description }) => {
  return (
    <Modal title={title} description={description} isOpen={isOpen} onClose={onClose}>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="destructive" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button type="button" onClick={onConfirm} disabled={isPending} className="flex items-center gap-2">
          {isPending ? (
            <>
              <Spinner className="w-4 h-4" /> Deleting...
            </>
          ) : (
            "Confirm"
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
