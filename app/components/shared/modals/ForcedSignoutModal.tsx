import React from "react";
import BaseModal from "./BaseModal";

const SignoutMessage = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold">Your session has expired !</h2>
      <p className="font-semibold text-lg">Signin you out ...</p>
    </BaseModal>
  );
};

export default SignoutMessage;
