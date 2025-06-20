import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Dashboard from "./Pages/Dashboard";
import ListPage from "./Pages/ListPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./Components/ui/sonner";

function App() {
  return (
    <>
      <Router>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/lists/:id" element={<ListPage />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
