import React from "react";
import { Button } from "./ui/button";
import Spinner from "./spinner";

interface SubmitButtonProps {
  isLoading: boolean;
  isLoadingTitle?: string;
  defaultTitle: string;
}
const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, isLoadingTitle, defaultTitle }) => {
  return (
    <Button type="submit" disabled={isLoading} className="flex items-center gap-2 text-sm w-full md:w-fit">
      {isLoading ? (
        <>
          <Spinner className="w-4 h-4" />
          {isLoadingTitle}
        </>
      ) : (
        <>{defaultTitle}</>
      )}
    </Button>
  );
};

export default SubmitButton;
