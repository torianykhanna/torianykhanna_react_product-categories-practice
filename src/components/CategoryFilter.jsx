export const CategoryFilter = ({
  categories,
  selectedCategoryIds,
  onToggleCategory,
  onClearCategories,
}) => (
  <div className="panel-block is-flex-wrap-wrap">
    <a
      href="#/"
      data-cy="AllCategories"
      className={`button is-success mr-6 ${
        selectedCategoryIds.length > 0 ? 'is-outlined' : ''
      }`}
      onClick={e => {
        e.preventDefault();
        onClearCategories();
      }}
    >
      All
    </a>
    {categories.map(category => (
      <a
        key={category.id}
        data-cy="Category"
        href="#/"
        className={`button mr-2 my-1 ${
          selectedCategoryIds.includes(category.id) ? 'is-info' : ''
        }`}
        onClick={e => {
          e.preventDefault();
          onToggleCategory(category.id);
        }}
      >
        {category.title}
      </a>
    ))}
  </div>
);
