/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-target-blank */
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { getToken, onMessage, getMessaging } from "firebase/messaging";
import { messaging } from "./firebase/firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import Message from "./components/Message";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [count, setCount] = useState(0);
  const [promoData, setPromoData] = useState([]);
  const { VITE_APP_VAPID_KEY, TOKEN_KEY } = import.meta.env;

  // API Call Function
  const fetchPromoData = async () => {
    try {
      const response = await axios.get("/api/v1/promo?page=2&pageSize=100", {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            `Bearer ${TOKEN_KEY}`, // Replace with your token if needed
        },
        // withCredentials: true, // Include credentials if required
        // credentials: "include", // Include credentials (cookies or auth headers)
      });

      setPromoData(response.data);
      console.log("Promo Data:", response.data);
    } catch (error) {
      console.error("Error fetching promo data:", error);
      toast.error("Failed to fetch promo data!");
    }
  };

  function requestPermission() {
    try {
      if (!("Notification" in window)) {
        console.error("This browser does not support desktop notifications");
        return;
      }

      // Check if service workers are supported
      if (!("serviceWorker" in navigator)) {
        console.error("Service workers are not supported");
        return;
      }

      Notification.requestPermission(function (permission) {
        console.log(permission);
        if (permission === "granted") {
          getToken(messaging, {
            vapidKey: VITE_APP_VAPID_KEY,
          })
            .then((token) => {
              console.log("Token generated:", token);
            })
            .catch((error) => {
              console.error("Error generating token:", error);
            });
        }
      });
    } catch (error) {
      console.error("Error in requestPermission:", error);
    }
  }

  const memoizedCallback = useCallback(() => {
    fetchPromoData();
  }, []);

  useEffect(() => {
    memoizedCallback();
  }, [memoizedCallback]);

  useEffect(() => {
    requestPermission();
  }, []);

  onMessage(messaging, (payload) => {
    console.log("incoming msg");
    toast(<Message notification={payload.notification} />);
  });

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <ToastContainer />
    </>
  );
}

export default App;
