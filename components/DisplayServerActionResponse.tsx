interface DisplayServerActionResponseProps {
  result: {
    data?: {
      message?: string;
    };
    serverError?: string;
    fetchError?: string;
    validationErrors?: Record<string, string[] | undefined> | undefined;
  };
}

export function DisplayServerActionResponse({
  result,
}: DisplayServerActionResponseProps) {
  const { data, serverError, fetchError, validationErrors } = result;

  return (
    <>
      {/* Success Message */}
      {data?.message ? <h2 className="my-2 text-xs">{data.message}</h2> : null}

      {serverError ? (
        <div className="my-2 text-red-500 text-xs">
          <p>{serverError}</p>
        </div>
      ) : null}

      {fetchError ? (
        <div className="my-2 text-red-500 text-xs">
          <p>{fetchError}</p>
        </div>
      ) : null}

      {validationErrors ? (
        <div className="my-2 text-red-500 text-xs">
          {Object.keys(validationErrors).map((key) => (
            <p key={key}>{`${key}: ${
              validationErrors &&
              validationErrors[key as keyof typeof validationErrors]
            }`}</p>
          ))}
        </div>
      ) : null}
    </>
  );
}
