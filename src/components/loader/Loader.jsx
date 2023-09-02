import { LoaderWrapper } from './Loader.styled'
import { Dna } from 'react-loader-spinner'
export const Loader = () => {
    return(<LoaderWrapper><Dna
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
        wrapperStyle={{
     }}
              wrapperClass="dna-wrapper"
        /></LoaderWrapper>)
}