import React, { useState, useEffect } from 'react';
import './Movie.css';
import placeholderImage from './assets/PicturePlaceholder-1.jpg'; 
import moviePlaceholderImage from './assets/poster-placeholder.png';
import { useParams } from 'react-router-dom'
import Reviews from './Reviews.js'

export default function Movie() {
  const { movieID } = useParams();
  const API_KEY = 'b26cb4c9f604b9ae30ee9cc23b9ef45f';
  const API_URL = 'https://api.themoviedb.org/3/movie';

  const [details, setDetails] = useState({});
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);

  const fetchDetails = async () => {
    const response = await fetch(`${API_URL}/${movieID}?api_key=${API_KEY}`);
    const data = await response.json();
    setDetails(data);
  };

  const fetchCast = async () => {
    console.log(movieID);
    const response = await fetch(`${API_URL}/${movieID}/credits?api_key=${API_KEY}`);
    const data = await response.json();
    setCast(data.cast);
  };

  const fetchReviews = async () => {
    const response = await fetch(`${API_URL}/${movieID}/reviews?api_key=${API_KEY}`);
    const data = await response.json();
    setReviews(data.results ? data.results : []); 
  };

  const fetchSimilarMovies = async () => {
    const response = await fetch(`${API_URL}/${movieID}/similar?api_key=${API_KEY}`);
    const data = await response.json();
    setSimilarMovies(data.results);
  };

  useEffect(() => {
    if(movieID) {
      fetchDetails();
      fetchCast();
      fetchReviews();
      fetchSimilarMovies();
    }
  }, [movieID, API_KEY]);

   // Format the release date to extract the year
   const releaseYear = details.release_date ? new Date(details.release_date).getFullYear() : 'N/A';

   // Format the user score percentage
   const userScore = details.vote_average ? `${(details.vote_average * 10).toFixed(0)}% User Score` : 'No score available';

   return (
    <div className="movie-details-container">
      <div className="movie-backdrop" style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`,
        backgroundSize: 'cover',
        padding: '20px',
      }}>
        <div className="movie-poster" style={{ float: 'left' }}>
          <img 
            src={`https://image.tmdb.org/t/p/original${details.poster_path}`} 
            alt={`${details.title} Poster`} 
            style={{ width: '200px', height: '300px', marginRight: '20px' }} 
          />
        </div>
        <div className="movie-info" style={{ color: 'white' }}>
          <h1 style={{ fontSize: '3rem' }}>{details.title} ({releaseYear})</h1>
          <p style={{ fontSize: '1.5rem' }}>
            {details.release_date} | 
            {details.genres ? details.genres.map(genre => genre.name).join(', ') : 'Loading genres...'} | 
            {details.runtime} minutes
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: '#0f3c4c', padding: '5px 10px', borderRadius: '5px' }}>
              {userScore}
            </div>
          </div>
          <p style={{ marginTop: '20px' }}>{details.overview}</p>
        </div>
      </div>
      <div className="movie-cast" style={{ padding: '20px' }}></div>

      <h2>Cast</h2>
      <div className="cast-list">
        {cast.map(member => (
          <a href={"/actor/" + member.id}>
            <div key={member.cast_id} className="cast-card">
              <img 
                src={member.profile_path ? `https://image.tmdb.org/t/p/w500${member.profile_path}` : placeholderImage}
                alt={member.name} 
                style={{ width: '100px', height: '150px' }}
              />
              <p className="cast-name">{member.name}</p>
              <p className="cast-character">{member.character}</p>
            </div>
          </a>
        ))}
      </div>
      <Reviews movieid={movieID} moviename={details.title} APIreviews={reviews}/>
      {/*
      <h2>Reviews</h2>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map(review => (
            <li key={review.id}>
              <p>{review.author}</p>
              <p>{review.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews available.</p>
      )}
      {reviews.length > 0 ? (
        <a href={`${API_URL}/${movieID}/reviews?api_key=${API_KEY}`} target="_blank" rel="noopener noreferrer">
          Read all reviews
        </a>
      ) : (
        <a href={`${API_URL}/${movieID}/reviews?api_key=${API_KEY}`} target="_blank" rel="noopener noreferrer">
          Write a review
        </a>
      )}
      */}

      <h2>Similar Movies</h2>
      <div className="similar-movies-list">
        {similarMovies.map(movie => (
          <a href={"/movie/" + movie.id}>
            <div key={movie.id} className="similar-movie-card">
              <img 
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : moviePlaceholderImage}
                alt={movie.title}
                style={{ width: '100px', height: '150px' }} 
              />
              <p>{movie.title}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
