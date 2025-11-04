import { useLocation, useNavigate, useParams } from 'react-router-dom';

export function withRouterCompat(WrappedComponent) {
  return function Wrapper(props) {
    // Delay hook usage until inside a real router context
    try {
      const location = useLocation();
      const navigate = useNavigate();
      const params = useParams();

      return (
        <WrappedComponent
          {...props}
          match={{ params }} // <-- Injects match.params
          location={location}
          navigate={navigate}
        />
      );
    } catch (e) {
      // Return a fallback if not in a router context (optional)
      console.error("withRouterCompat: Not in router context", e);
      return null;
    }
  };
}
