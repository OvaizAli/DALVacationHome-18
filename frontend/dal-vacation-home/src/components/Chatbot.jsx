import React, { useContext, useEffect } from 'react'
import { UserContextProvider } from '../App';

function Chatbot() {

  const { isLoggedIn, setIsLoggedIn } = useContext(UserContextProvider);

  useEffect(() => {
    if (!window.kommunicate) {
      (function (d, m) {
        var kommunicateSettings = {
          "appId": isLoggedIn ? "10099a14177fe3fd9af9ef790600af218" : "307ce062104cbf77734479800ee1c82ec",
          "popupWidget": true,
          "automaticChatOpenOnNavigation": true
        };
        var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
        window.kommunicate = m; m._globals = kommunicateSettings;
      })(document, window.kommunicate || {});
    } else {
      window.kommunicate._globals.appId = isLoggedIn ? "10099a14177fe3fd9af9ef790600af218" : "307ce062104cbf77734479800ee1c82ec";
    }
  }, [isLoggedIn]);

  return null;
}

export default Chatbot
