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


  async componentDidMount() {
    
    const { query } = this.state
    
    if (!query) {
      return;
    }

    try {
      this.setState({
        loading: true,
      })

      const {hits} = await serviceGallery(query)
  
       

      this.setState({
        images: hits,
      })
 

     console.log("hits", hits)
    } catch (error) {
      console.log(error)
      this.setState({
        error: true,
      })
    } finally {
      this.setState({
        loading: false,
      })
    }
  }
  

  async componentDidUpdate(prevProps, prevState) {
    const {query,page,images} = this.state

    if (prevState.query !== query || prevState.page !== page) {
      try {
        this.setState({ loading: true,error : false,images : []})
        
        const { hits ,totalHits} = await serviceGallery(query, page)
        
        if (page === Math.ceil(totalHits / 12)) {
          console.log(totalHits)
          toast.success('You have reached the end of the list of images found')
          this.setState({
            images: [...images],
            showLoadMoreButton: false,  
          })
          return
        }

        if (hits.length === 0) {
          this.setState({
             searchFailed: true,
           })
         }   

        this.setState({
          images: [...images, ...hits],
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

  handleSubmit = (e) => {
      e.preventDefault();
      
      const inputValue = `${Date.now()}/${e.target.elements.query.value.trim()}`
      const sliced = inputValue.split('/')
      const query = sliced[1];

    if (!query) {
        toast.error('You need input something')
        return
      }
  

      this.setState({
      prevQuery: query,
      query: query,
      images: [],
      page: 1,
      error: false, 
    })
      e.target.reset()
  }
  
  handleLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }))
  }

  render() {

    const {images,loading,error,page,showLoadMoreButton,searchFailed} = this.state


    return (
      <div>
        <Searchbar onSubmit={this.handleSubmit} />
        {loading && <Loader />}
        {images.length > 0 && (<ImageGallery hits={images} />)}
        { page === 40 && (toast.success('You have reached the last page'))}
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
