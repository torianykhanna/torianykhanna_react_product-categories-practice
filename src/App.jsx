/* eslint-disable jsx-a11y/accessible-emoji */
import { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

import { CategoryFilter } from './components/CategoryFilter';

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();

  const products = productsFromServer.map(product => {
    const category = categoriesFromServer.find(
      cat => cat.id === product.categoryId,
    );

    const user = usersFromServer.find(u => u.id === category.ownerId);

    return {
      ...product,
      category,
      user,
    };
  });

  const visibleProducts = products.filter(product => {
    const matchesUser = selectedUserId
      ? product.user.id === selectedUserId
      : true;

    const matchesCategory =
      selectedCategoryIds.length === 0
        ? true
        : selectedCategoryIds.includes(product.category.id);

    const matchesQuery = product.name.toLowerCase().includes(normalizedQuery);

    return matchesUser && matchesCategory && matchesQuery;
  });

  const toggleCategory = categoryId => {
    setSelectedCategoryIds(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }

      return [...prev, categoryId];
    });
  };

  const resetAllFilters = () => {
    setSelectedUserId(null);
    setSelectedCategoryIds([]);
    setQuery('');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>
        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>
            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={!selectedUserId ? 'is-active' : ''}
                onClick={e => {
                  e.preventDefault();
                  setSelectedUserId(null);
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={selectedUserId === user.id ? 'is-active' : ''}
                  onClick={e => {
                    e.preventDefault();
                    setSelectedUserId(user.id);
                  }}
                >
                  {user.name}
                </a>
              ))}
            </p>
            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <CategoryFilter
              categories={categoriesFromServer}
              selectedCategoryIds={selectedCategoryIds}
              onToggleCategory={toggleCategory}
              onClearCategories={() => setSelectedCategoryIds([])}
            />

            <div className="panel-block">
              <button
                data-cy="ResetAllButton"
                type="button"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAllFilters}
              >
                Reset all filters
              </button>
            </div>
          </nav>
        </div>
        <div className="box table-container">
          {visibleProducts.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {visibleProducts.length > 0 && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  {['ID', 'Product', 'Category', 'User'].map(title => (
                    <th key={title}>
                      <span className="is-flex is-flex-wrap-nowrap">
                        {title}
                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>

                    <td data-cy="ProductCategory">
                      {product.category.icon} - {product.category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                        product.user.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
