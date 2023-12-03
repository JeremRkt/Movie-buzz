import React, {useState, useEffect} from "react";
import {useParams} from 'react-router-dom'
import axios from "axios";
import './Actor.css'

const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const MOVIES_PER_PAGE = 6;
export default function Actor() {
    //actorID - Passed in through URL from the movie page. 
    //Corrosponds to person_id used here: https://developer.themoviedb.org/reference/person-details

    // Extracting the actor ID from the URL parameters
    let {actorID} = useParams()

    //State for storing actor details
    const [actorDetails, setActorDetails] = useState(null);
    //State for storing movies in which the actor has acted
    const [movies, setMovie] = useState([]);
    //State for tracking the current page for pagination
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        //Function to fetch actor details and movie credits from the API
        async function fetchActorDetails() {
            try {
                //Fetching actor details from The Movie Database API
                const response = await axios.get(`https://api.themoviedb.org/3/person/${actorID}?api_key=6e5107aef2ad1f8cf3191a841efd735a`);
                setActorDetails(response.data);

                //Fetching movie in which the actor has acted
                const movieResponse = await axios.get(`https://api.themoviedb.org/3/person/${actorID}/movie_credits?api_key=6e5107aef2ad1f8cf3191a841efd735a`);
                setMovie(movieResponse.data.cast);
            } catch (error) {
                console.error('Error fetching actor details.', error);
            }
        }

        fetchActorDetails();
    }, [actorID]); // Effect dependency on actorID

    // Calculating indices for pagination
    const indexOfLastMovie = currentPage * MOVIES_PER_PAGE;
    const indexOfFirstMovie = indexOfLastMovie - MOVIES_PER_PAGE;
    //Slicing the movies array to get movies from the current page
    const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

    //Function to handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    return (
        <div className="page-container">
            {actorDetails && (
                <div className="main-container">
                    <div className="upper-container">
                        <div className="actor-profile-container">
                                <img src={`${BASE_IMAGE_URL}${actorDetails.profile_path}`} alt={actorDetails.name}/>
                                <h1 className="actor-name">{actorDetails.name}</h1>
                                <p className="actor-biography">{actorDetails.biography}</p>
                        </div>
                    </div>
                    <div className="lower-container">
                        <div className="filmography-header">
                            <h2>Filmography</h2>
                        </div>

                        <div className="movies-container">
                            {currentMovies.map(movie => (
                                <a href={`/movie/${movie.id}`}>
                                    <div key={movie.id} className="movie-item">
                                        <img src={`${BASE_IMAGE_URL}${movie.poster_path}`} alt={`${movie.title} Poster`}/>
                                        <h3>{movie.title}</h3>
                                        <p>Role: {movie.character}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                        <div className="pagination">
                            {[...Array(Math.ceil(movies.length / MOVIES_PER_PAGE)).keys()].map(number => {
                                const isActive = number + 1 === currentPage;
                                return (
                                    <button key={number + 1} className={`page-item ${isActive ? 'active' : ''}`}
                                            onClick={() => paginate(number + 1)}
                                    >
                                        {number + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}