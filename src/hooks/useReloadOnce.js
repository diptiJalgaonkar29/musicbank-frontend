import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function useReloadOnce() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const shouldReload = urlParams.get("reload") === "1";

    if (shouldReload) {
      console.log("✅ Reload logic running...");

      // 🔁 Remove the reload param from the URL
      urlParams.delete("reload");

      navigate(
        {
          pathname: location.pathname,
          search: urlParams.toString(),
        },
        { replace: true }
      ); // ✅ Don't push to history

      // 🧠 Put your one-time reload logic here
      // For example: window.location.reload(); OR custom theme refresh
      window.location.reload();
    }
  }, [location, navigate]);
}

export default useReloadOnce;
