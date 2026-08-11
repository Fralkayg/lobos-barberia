import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ScrollToHash from "./components/ScrollToHash";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Layout>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reservar" element={<BookingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
