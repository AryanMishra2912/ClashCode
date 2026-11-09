import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProblemList from "./pages/ProblemList";
import ProblemDetail from "./pages/ProblemDetail";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Navbar appears on every page */}
        <Navbar />

        <Routes>
          {/* Public route — anyone can visit the start page */}
          <Route path="/" element={<Home />} />

          {/* Guest-only routes — logged-in users are redirected to /problems */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Protected routes — guests are redirected to /login */}
          <Route element={<ProtectedRoute />}>
            <Route path="/problems" element={<ProblemList />} />
            <Route path="/problem/:id" element={<ProblemDetail />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
