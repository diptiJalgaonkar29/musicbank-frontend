import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FallBackPage from "../../pages/FallBackPage";

const SearchParamsWrapper = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reload = params.get("reload");

    if (reload === "1") {
      // Show fallback page immediately
      setShowFallback(true);

      // Delay URL cleanup and reload to let fallback render
      setTimeout(() => {
        // Remove ?reload=1 from URL
        params.delete("reload");
        navigate(
          {
            pathname: location.pathname,
            search: params.toString(),
          },
          { replace: true }
        );

        // Reload the page to reset state
        window.location.reload();
      }, 50); // Give time for fallback UI to render
    }
  }, [location, navigate]);

  if (showFallback) {
    return <FallBackPage />;
  }

  return <>{children}</>;
};

export default SearchParamsWrapper;
