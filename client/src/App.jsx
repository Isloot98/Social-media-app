import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Categories from "./components/Categories";
import Gaming from "./components/Gaming";
import Sports from "./components/Sports";
import Fitness from "./components/Fitness";
import Tech from "./components/Tech";
import SoftwareDevelopment from "./components/SoftwareDevelopment";
import AnythingElse from "./components/AnythingElse";
import styles from "./App.module.css";

const App = () => {
  return (
    <div className={styles.appContainer}>
      <div className={styles.navigation}>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            <span>Home</span>
          </Link>
          <Link to="/categories" className={styles.navLink}>
            <span>Categories</span>
          </Link>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories/*" element={<Categories />} />
        <Route path="/categories/Sports" element={<Sports />} />
        <Route path="/categories/Fitness" element={<Fitness />} />
        <Route path="/categories/Tech" element={<Tech />} />
        <Route path="/categories/Gaming" element={<Gaming />} />
        <Route path="/categories/AnythingElse" element={<AnythingElse />} />
        <Route
          path="/categories/SoftwareDevelopment"
          element={<SoftwareDevelopment />}
        />

        <Route path="*" element={<div className={styles.notFound}>404</div>} />
      </Routes>
    </div>
  );
};

export default App;
