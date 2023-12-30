import { PropsWithChildren, useEffect } from "react";

interface DialogType {
  dataTestId: string;
  isOpen: boolean;
  closeDialog: () => void;
}

function Dialog({
  dataTestId,
  isOpen,
  closeDialog,
  children,
}: PropsWithChildren<DialogType>) {
  useEffect(() => {
    if (isOpen) {
      window.scrollTo(0, 0);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="w-screen h-screen absolute top-0 z-50 left-0"
      data-testid={dataTestId}
    >
      {/* gray bg */}
      <div
        aria-label="Background"
        aria-hidden="true"
        className="w-full h-full flex fixed top-0 z-50 opacity-50 bg-gray-900 p-96"
        data-testid="gray-bg"
        onClick={() => closeDialog()}
      />
      {/* inner container */}
      <div className="w-full h-full flex justify-center items-center">
        <div className="relative bg-white z-50 w-full h-auto  max-w-screen-md md:rounded-2xl md:p-7">
          <div
            aria-label="Close"
            aria-hidden="true"
            className="cursor-pointer -mt-4 -mr-2 md:-mt-10 md:-mr-3 absolute right-0 w-9 h-9 flex justify-center items-center rounded-full bg-peral"
            onClick={() => closeDialog()}
            data-testid={`close-${dataTestId}`}
          >
            <span className="text-sm pt-6 pr-5">&#10006;</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Dialog;
