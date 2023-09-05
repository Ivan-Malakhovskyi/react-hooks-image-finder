import { Component } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { Searchbar } from "./searchBar/SearchBar";
import { ImageGallery } from "./imageGallery/ImageGallery";
import { Loader } from "./loader/Loader";
import { Button } from "./button/Button";
import { serviceGallery } from "./apiImageService";
import { GlobalStyle } from "GlobalStyle";
import { ErrorMsg } from "./loader/Loader.styled";


export class App extends Component {
  state = {
    query: '',
    error: false,
    loading: false,
    prevQuery: '',
    images: [],
    page: 1,
    showLoadMoreButton: true,
    searchFailed: false
  }

  

  async componentDidUpdate(prevProps, prevState) {
    const {query,page} = this.state

    if (prevState.query !== query || prevState.page !== page) {
      try {
        this.setState({ loading: true,error : false})
        
        const { hits, totalHits } = await serviceGallery(query, page)
        

        const filteredNeedsValues = () => {
             this.setState( prevState => ({
            images: [...prevState.images, ...hits.map((image) => ({
              id: image.id,
              largeImageURL: image.largeImageURL,
              webformatURL: image.webformatURL,
              tags: image.tags,  
            }))],
            showLoadMoreButton: false,  
          }))
        }
         
        if (page === Math.ceil(totalHits / 12)) {
          toast.success('You have reached the end of the list of images found')
         filteredNeedsValues()
          return
        }

        if (hits.length === 0) {
          this.setState({
             searchFailed: true,
           })
         }   

        filteredNeedsValues()
        this.setState({
          showLoadMoreButton: true,
        })
      
    
      } catch (error) {
        console.log(error)
        this.setState({
          error : true
        })
      } finally {
        this.setState({loading: false})
      }
    }
  }

  handleSubmit = (query) => {

   
      this.setState({
      prevQuery: this.state.query,
      query: query,
      images: [],
      page: 1,
      error: false, 
    })
  }
  
  handleLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }))
  }

  render() {

    const {images ,loading,error,page,showLoadMoreButton,searchFailed} = this.state


    return (
      <div>
        <Searchbar onSubmit={this.handleSubmit} />
        {loading && <Loader />}
        {images.length > 0 && (<ImageGallery hits={images}  />)}
        { page === 41 && (toast.success('You have reached the last page'))}
        { searchFailed && images.length === 0 && !loading && (
        <ErrorMsg>Such images was not found, try find something else 😉</ErrorMsg>)}
        {error && !loading && (<ErrorMsg>❌ Something went wrong,try reload page{toast.error('Ooops, something went wrong')}
        </ErrorMsg>)}
        {images.length > 0 && showLoadMoreButton && !loading && (<Button loadMore={this.handleLoadMore} />)}
        <Toaster />
        <GlobalStyle/>
      </div>
    )
  }
}
