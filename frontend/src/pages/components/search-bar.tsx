import "./search-bar.css";

function SearchBar() {
  return (
    <>
      <div className="search-bar">
        <input placeholder="Search" className="search-input" />
        <i className="fa-solid fa-magnifying-glass search-icon"></i>
      </div>
    </>
  );
}

export default SearchBar;
