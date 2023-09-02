import { SearchBar, SearchForm, SearchFormButton, SearchFormButtonLabel, SearchFormInput } from "components/searchBar/SerchBar.styled"


export const Searchbar = ({onSubmit}) => {
    return (<SearchBar className="searchbar">
  <SearchForm className="form" onSubmit={onSubmit}>
    <SearchFormInput
      className="input"
        type="text"
        name="query"
      autoComplete="off"
      autoFocus
      placeholder="Search images and photos"
            />
             <SearchFormButton type="submit" className="button">
      <SearchFormButtonLabel className="button-label">Search</SearchFormButtonLabel>
    </SearchFormButton>
  </SearchForm>
</SearchBar>)
}