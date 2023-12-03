import { useEffect, useState } from 'react'
import './Reviews.css'
import WriteReviewBlock from './WriteReview.js'
// Reference: https://github.com/n49/react-stars
import ReactStars from "react-rating-stars-component"
import ReactMarkdown from 'react-markdown'
import { v4 as uuidv4 } from 'uuid'

export default function Reviews({movieid, moviename, APIreviews}) {
    // fetch API reviews to display
    const APIreviewsToDisplay = []
    if(APIreviews){
        for (const item of APIreviews){
            // create item object for rendering for each review
            const newItem = {
                id: uuidv4(),
                moviename: moviename,
                reviewer: item.author,
                movieid: movieid,
                rating: null,
                content: item.content,
            }
            APIreviewsToDisplay.push(newItem)
        }
    }
    
    const isReviewPage = (movieid === undefined)
    // reviews state
    const [reviews, setReviews] = useState(
        JSON.parse(localStorage.getItem('reviews'))
    )
    // expand / collapse state
    const [expand, setExpand] = useState(false)
    // add & del review
    const addReview = (review) =>{
        setReviews([...reviews, review])
    }
    const delReview = (id) => {
        setReviews(reviews.filter((item) => item.id !== id))
    }
    // flip expand state
    const triggerExpand = (e) => {
        if (expand === true){
            setExpand(false)
            e.target.innerText = "Expand"
        }
        else{
            setExpand(true)
            e.target.innerText = "Collapse"
        }
    }
    
    // syncronize localStorage with state
    useEffect(() => {
        if(reviews == null) { 
            setReviews([]);
        }
    }, [])
    useEffect(() => {
        localStorage.setItem('reviews', JSON.stringify(reviews))
    }, [reviews])
    
    return (
        <div className="reviews-container">
            <Reviewsheader/>
            {
                // concat custom reviews and API reviews
                (reviews == null ? []: reviews).concat(APIreviewsToDisplay)
                // only display current movie's reviews
                .filter((item) => isReviewPage || item.movieid === movieid)
                // check if expanded
                .slice(0, (expand?undefined:2))
                // create a ReviewContent object for each review to display
                .map(function(item){
                    return <ReviewContent 
                            delReview={delReview} 
                            id = {item.id}
                            movieid={item.movieid} 
                            moviename={isReviewPage && item.moviename} 
                            rating={item.rating} 
                            content={item.content}
                            reviewer={item.reviewer}
                        />
                })
            }
            {
                // expand or collapse
                ((reviews == null ? []: reviews).concat(APIreviewsToDisplay)
                .filter((item) => isReviewPage || item.movieid === movieid)).length > 0 &&
                <div className='expand-all-link' onClick={triggerExpand}>
                    Expand
                </div>
            }
            {
                // "write a new review" component
                !isReviewPage &&
                <WriteReviewBlock addreview={addReview} moviename={moviename} movieid={movieid}/>
            }
        </div>
    )
}

function Reviewsheader(){
    return (
        <header id="reviews-header">
            <h2>Reviews</h2>
        </header>
    )
}

function ReviewContent({delReview, id, movieid, moviename, content, rating, reviewer}){
    return (
        <div className='review-content'>
            <div className='review-header'>
                {
                    // display movie name if needed
                    moviename && 
                    <a href={"/movie/" + movieid}>
                        {moviename}
                    </a>
                }
                {
                    // display reviewer if needed
                    !moviename && <b>{reviewer}</b> 
                }
                {
                    // display close button if needed
                    reviewer === "Guest" && 
                    <button onClick={() => delReview(id)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                }
            </div>

            <ReactMarkdown>
                {
                    // display reviews in markdown format
                    content
                }
            </ReactMarkdown>

            {   
                
                // show rating stars if needed
                rating && <ReactStars
                    count={5}
                    value={rating}
                    edit={false}
                    size={24}
                    activeColor="#ffd700"
                />
            }
        </div>
    )
}