interface IFieldError {
  error: string | undefined;
}
const FieldError: React.FC<IFieldError> = ({ error }) => {
  return <div className="text-red-500 text-xs font-light">{error}</div>;
};

export default FieldError;
