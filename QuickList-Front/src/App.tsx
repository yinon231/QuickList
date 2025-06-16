import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Dashboard from "./Pages/Dashboard";
import ListPage from "./Pages/ListPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
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
