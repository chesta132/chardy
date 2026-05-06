"use client";

import { toastError } from "@/components/ui/Toaster";
import { createContext, useContext, useState, Component, ReactNode, useEffect } from "react";

// context

export type GlobalError = Error | null;
export type SetGlobalError = React.Dispatch<React.SetStateAction<Error | null>>;

type GlobalErrorValue = {
  error: GlobalError;
  setError: SetGlobalError;
  clearError: () => void;
};

const GlobalErrorContext = createContext<GlobalErrorValue | null>(null);

export const GlobalErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<GlobalError>(null);
  const clearError = () => setError(null);

  return (
    <GlobalErrorContext.Provider value={{ error, setError, clearError }}>
      <SilentErrorBoundary onError={setError}>{children}</SilentErrorBoundary>
    </GlobalErrorContext.Provider>
  );
};

export const useGlobalError = () => {
  const ctx = useContext(GlobalErrorContext);
  if (!ctx) throw new Error("useGlobalError must be used within GlobalErrorProvider");
  return ctx;
};

// show component

export const ViewGlobalError = () => {
  const { error } = useGlobalError();

  useEffect(() => {
    if (error) {
      toastError(error);
    }
  }, [error]);

  return null;
};

// silent boundary

type SilentBoundaryProps = {
  children: ReactNode;
  onError: (error: Error) => void;
};

class SilentErrorBoundary extends Component<SilentBoundaryProps> {
  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    // render children as is
    return this.props.children;
  }
}
