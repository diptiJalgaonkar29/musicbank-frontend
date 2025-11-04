import React, { useState, useEffect, useRef } from "react";
import Keycloak from "keycloak-js";

const client = new Keycloak({
  url: "https://sonicspace.sonic-hub.com:8443/",
  realm: "wpp-dev-realm",
  clientId: "wpp-dev-client",
});

const useAuth = () => {
  const isRun = useRef(false);
  const [token, setToken] = useState(null);
  const [isLogin, setLogin] = useState(false);

  useEffect(() => {
    if (isRun.current) return;

    isRun.current = true;
    client
      .init({
        onLoad: "login-required",
      })
      .then((res) => {
        // console.log("res", res);
        setLogin(res);
        setToken(client.token);
      })
      .catch((err) => console.log("err", err));
  }, []);

  return [isLogin, token];
};

export default useAuth;
