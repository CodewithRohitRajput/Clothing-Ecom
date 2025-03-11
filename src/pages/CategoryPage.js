import React from 'react';
import { useParams } from 'react-router-dom';
import ProductList from '../components/ProductList';

const CategoryPage = () => {
  const { category } = useParams();

  const getCategoryTitle = (category) => {
    switch (category) {
      case 'mens':
        return "Men's Wear";
      case 'womens':
        return "Women's Wear";
      case 'kids':
        return "Kids Wear";
      case 'trending':
        return "Trending Products";
      default:
        return "Products";
    }
  };

  return (
    <div className="container">
      <div className="category-header">
        <h1>{getCategoryTitle(category)}</h1>
        <p>Discover our collection of {getCategoryTitle(category).toLowerCase()}</p>
      </div>

      <ProductList category={category} title={`All ${getCategoryTitle(category)}`} />
    </div>
  );
};

export default CategoryPage; 