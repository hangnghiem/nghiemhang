import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Lesson from "./pages/Lesson.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useProgress } from "./lib/progress.js";

export default function App() {
  const { completed, toggle, isDone } = useProgress();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar completedCount={completed.size} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home isDone={isDone} />} />
          <Route
            path="/lesson/:slug"
            element={<Lesson isDone={isDone} toggle={toggle} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
