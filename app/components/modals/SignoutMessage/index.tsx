import { Dialog } from "@headlessui/react";
import React from "react";

const SignoutMessage = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center gap-6 p-4 text-center">
        <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl text-matchita-text-alt">
            <h2 className="text-2xl font-bold">Your session has expired !</h2>
            <p className="font-semibold text-lg">Signin you out ...</p>
        </div>
      </div>
    </Dialog>
  );
};

export default SignoutMessage;
