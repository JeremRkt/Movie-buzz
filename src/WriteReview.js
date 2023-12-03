import './Reviews.css'
import { useState } from 'react'
import ReactStars from "react-rating-stars-component"
import { v4 as uuidv4 } from 'uuid'

export default function WriteReviewBlock({addreview, movieid, moviename}) {
    // rating and content states
    const [rating, setRating] = useState(5)
    const [content, setContent] = useState("")

    // add a new custom review to system
    const clickSubmit = function(e){
        e.preventDefault()
        const newReview = {
            id: uuidv4(),
            moviename: moviename,
            reviewer: "Guest",
            movieid: movieid,
            rating: rating,
            content: content,
        }
        addreview(newReview);
        setRating(5)
        setContent("")
    }

    // handle text and rating change
    const textChange = function(e){
        setContent(e.target.value)
    }
    const ratingChange = function(v){
        setRating(v)
    }

    return (
        <div className="write-review-block">
            <h3>Write your review</h3>
            
            <textarea placeholder="write a review" id="review-input-box" onChange={textChange} value={content}></textarea>
            <div id="review-bottom">
                <ReactStars
                    count={5}
                    size={24}
                    value={rating}
                    onChange={ratingChange}
                    activeColor="#ffd700"
                />
                <button id="submit-review" onClick={clickSubmit}> submit </button>
            </div>
        </div>
    )
}
