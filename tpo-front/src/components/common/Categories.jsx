import React, { useState, useEffect } from "react";
import categoryService from "../../services/categoryService";
import Loading from "./LoadingScreen";
import Error from "./Error";
import "./Categories.css";

const Categories = ({ onCategoryClick, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
        setError("No se pudieron cargar las categorías");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return <Loading containerClassName="categories-container" />;
  }

  if (error) {
    return <Error message={error} containerClassName="categories-container" />;
  }

  return (
    <div className="categories-container">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryClick(category.id)}
          className={selectedCategory === category.id ? "selected" : ""}
        >
          <h1>{category.name}</h1>
        </button>
      ))}
    </div>
  );
};

export default Categories;
