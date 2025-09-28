import React from "react";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import router from "./routes";

function App() {
  return (
    <ConfigProvider>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
