import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./redux/store.js";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster
        position="top-center"
        gutter={8}
        toastOptions={{
          style: {
            fontWeight: 600,
            fontSize: "1.2rem",
            padding: "8px 20px",
          },
          success: {
            duration: 2000,
          },
          error: {
            duration: 2000,
          },
        }}
      />{" "}
      <App />
    </Provider>
  </StrictMode>,
);
