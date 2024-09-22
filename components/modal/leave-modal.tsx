import React from "react";
import Modal from "../ui/modal";
import { Button } from "../ui/button";
import Spinner from "../spinner";

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;

  description: string;
}
const LeaveModal: React.FC<LeaveModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isPending,

  description,
}) => {
  return (
    <Modal description={description} isOpen={isOpen} onClose={onClose}>
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="destructive"
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="button" onClick={onConfirm} disabled={isPending}>
          {isPending ? <Spinner /> : "Confirm"}
        </Button>
      </div>
    </Modal>
  );
};

export default LeaveModal;
