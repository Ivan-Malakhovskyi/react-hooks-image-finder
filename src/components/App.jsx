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
    images: [],
    page: 1,
    showLoadMoreButton: true,
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
    const {query,page} = this.state

    if (prevState.query !== query || prevState.page !== page) {
      try {
        this.setState({ loading: true,error : false })
        
        const { hits ,totalHits} = await serviceGallery(query, page)
        
        if (page === 1) {
          this.setState({
            images: hits,
          }) 
        }
        
        if (page === Math.ceil(totalHits / 40)) {
          toast.success('You have reached the end of the list of images found')
          this.setState({
            showLoadMoreButton: false,  
          })
          return
        }

  //       if (images.length === 0) {
  //         return toast.error('Sorry, there are no images matching your search query. Please try again.', {
  //            position: 'top-center',
  //          style: {
  //   background: 'blue', // Колір фону повідомлення
  //   color: 'white', // Колір тексту повідомлення
  // },  
  //         })
  //         }

      
        
          this.setState(prevState => ({
            images: [...prevState.images, ...hits]
          }))
      

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
      
      const query = e.target.elements.query.value.trim();
      if (!query) {
        return
      }

    this.setState({
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

    const {images,loading,error,page,totalHits} = this.state

 const allImagesLoaded = images.length >= totalHits;
    return (
      <div>
        <Searchbar onSubmit={this.handleSubmit} />
        {loading &&  <Loader />}
        {images.length > 0 && (<ImageGallery hits={images} />)}
        {page === 12 && (toast.success('You have reached the last page'))}
        { images.length === 0 && (
        <ErrorMsg>Images not found</ErrorMsg>)}
        {error && !loading && (<ErrorMsg>❌ Something went wrong,try reload page{toast.error('Ooops, something went wrong')}
        </ErrorMsg>)}
        
        { images.length > 0 && !allImagesLoaded &&   (<Button loadMore={this.handleLoadMore} />)}
        <Toaster />
        <GlobalStyle/>

      </div>
    )
  }
}
