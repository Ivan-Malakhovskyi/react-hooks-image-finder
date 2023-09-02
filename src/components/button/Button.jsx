import { BtnWrapper, LoadMoreBtn } from "./Button.styled"




export const Button = ({loadMore}) => {
    return(<BtnWrapper><LoadMoreBtn onClick={loadMore} type="button">Load more</LoadMoreBtn></BtnWrapper>)
}