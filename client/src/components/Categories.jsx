import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Categories.module.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/get-all-categories"
        );
        const categoryData = await response.json();
        setCategories(categoryData);
      } catch (err) {
        console.log(err);
      }
    };
    getCategories();
  }, []);

  return (
    <div className={styles.categoriesContainer}>
      <h1 className={styles.heading}>Categories</h1>

      <ul className={styles.categoryList}>
        {categories.map((category) => (
          <li key={category.catid} className={styles.categoryItem}>
            <Link
              to={`/categories/${category.categoryname}`}
              className={styles.categoryLink}
            >
              {category.categoryname}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
