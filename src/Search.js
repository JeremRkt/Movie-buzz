import * as Util from './Util.js'
import React, { useState, useEffect } from 'react';
import './Search.css'
import ReactStars from 'react-stars'
//I'm not sure if we should have separate stylesheets or dump everything in App.css, so I'm using my own for now

export default function Search() {
    //State variables that update to whatever is being sent to the API based on page state
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [adult, setAdult] = useState(false);
    const [year, setYear] = useState("");
    //State variables that update based on API returns. Used to render the page
    const [movies, setMovies] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    //Fancy declarative react thing that took 2 hours for me to understand
    //Updates the movies variable w/ latest api call whenever query, page, etc are updated
    //React is WEIRD
    useEffect(() => {
        fetch(Util.constructQuery("/search/movie", {"query" : query, "page" : page, "adult": adult, "primary_release_year": year}))
        .then(response => response.json())
        .then(data => {
            setMovies(data["results"]);
            const footer = document.getElementById("search-footer");
            if(data["results"].length > 0) {
                footer.style.display = "flex";
                const footerPageNumber = document.getElementById("footer-page-number");
                footerPageNumber.value = "";
            } else {
                footer.style.display = "none";
            }
            setTotalPages(data["total_pages"]);
        });
    }, [query, page, adult, year]);
    
    //If enter is hit on the input box, set query to input box value
    function handleKeyDown(event) {
        if(event.key === "Enter") {
            handleSearch();
        }
    }

    //If the search box is triggered, set query and page so that the useeffect hook queries the API
    function handleSearch() {
        setQuery(document.getElementById("search-box").value);
        setYear(document.getElementById('search-release').value);
        setPage(1);
    }

    //If the input is changed directly, update page with it
    function handleFooterInputChange(event) {
        if(event.key === "Enter") {
            if(!isNaN(event.currentTarget.value) && event.currentTarget.value > 0 && event.currentTarget.value <= totalPages) {
                setPage(event.currentTarget.value);
            }
        }
    }

    //If the year value is changed, update the state accordingly and reset page
    function handleYearInputChange(event) {
        if(event.key === "Enter") {
            setPage(1);
            setQuery(document.getElementById("search-box").value);
            setYear(event.currentTarget.value);
        }
    }

    return (
        <div id="search-container">
            {/* <img id="image" src="assets/MB.png" alt="Movie Buzz" /> */}
            <header id="search-header">
                {/* <img id="filter-button" onClick={handleFilterClick} src="/filter.svg" alt="Filters"></img> */}
                <div id="search-bar">
                <input id="search-box" placeholder="Search for a movie" onKeyDown={handleKeyDown}></input>
                <button id="search-btn" type="submit" onClick={handleSearch}>Search</button>
                </div>
                <nav>
                    <div id="search-filter">
                        <h4> Include Mature Results </h4>
                        <input type="radio" id="search-filter-adult-off" name="adult" onClick={() => {setPage(1); setAdult(false)}} defaultChecked/>
                        <label htmlFor="search-filter-adult-off">Off</label>
                        <input type="radio" id="search-filter-adult-on" name="adult" onClick={() => {setPage(1); setAdult(true)}}/>
                        <label htmlFor="search-filter-adult-on">On</label>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;</p>
                        <h4>Release Year:</h4>
                        <input id="search-release" type="number" onKeyDown={handleYearInputChange}/>
                    </div>
                </nav>
            </header>
            <main id="search-body">
                <div id="search-results">
                    {movies.map((movie, index) => (
                        <MovieTile key={index} id={movie.id} img={movie.backdrop_path} title={movie.title} description={movie.overview} rating={movie.vote_average / 2}/>
                    ))}
                </div>
            </main>
            <footer id="search-footer" hidden>
                <button id="footer-button-first" disabled={page === 1} onClick={() => setPage(1)}> First </button>
                <button id="footer-button-prev" disabled={page === 1} onClick={() => setPage(page - 1)}> Prev </button>
                <input id="footer-page-number" placeholder={page} onKeyDown={handleFooterInputChange} type="number" min='1' max={totalPages} step='1'/>
                <button id="footer-button-next" disabled={page === totalPages} onClick={() => setPage(page + 1)}> Next </button>
                <button id="footer-button-last" disabled={page === totalPages} onClick={() => setPage(totalPages)}> Last</button>
            </footer>
        </div>
    )
}
 
//Self contained component for displaying each search result in a box that links to the appropriate movie page
function MovieTile({id, img, title, description, rating}) {
    return (
        <a href={"/movie/" + id}> 
            <div className="movie-tile"> 
                <img src={img ? "https://image.tmdb.org/t/p/original" + img : "/thumbnailfallback.png"} alt={"Thumbnail for " + {title}} />
                <div>
                    <h3> {title} </h3>
                    {description}
                    <div className='stars'>
                        <ReactStars count={5} edit={false} value={rating} half={true} size={30} />
                    </div>
                </div>
            </div>
        </a>
    )
}