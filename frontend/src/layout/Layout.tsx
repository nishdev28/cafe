import { Outlet, ScrollRestoration } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <ScrollRestoration />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Footer />
    </>
  );
}
