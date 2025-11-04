function withLoadingIndicator(Component) {
  return function EnhancedComponent({ isLoading, ...props }) {
    if (!isLoading) {
      return <Component {...props} />;
    }
    return (
      <div>
        <p>{props.loadingMessage}</p>
      </div>
    );
  };
}
const ListWithLoadingIndicator = withLoadingIndicator(List);

export default ListWithLoadingIndicator;

// Usage
// idLoading = required
// loadingMessage = required
//<ListWithLoadingIndicator isLoading={isLoading} loadingMessage={loadingMessage} />
