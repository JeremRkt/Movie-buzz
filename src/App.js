import './App.css';
import Search from './Search.js'
import Reviews from './Reviews.js'
import Movie from './Movie.js'
import Actor from './Actor.js'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import movieBuzz from "./assets/MBHeader.png"

function App() {


  //Renders a search box and a ul of all the elements in movies
  return (
      <Router>
        <div className='App'>
          {/* This is where you would put a header that you want to be shown over all the pages.
          May be useful for Manasvi's UI styling later */}
          <header id="app-header">
          <a href="/"> <img id="image-header" src={movieBuzz} alt="Movie Buzz" /></a>
            <div id="links-container">
              <a href="/reviews">
                <p>Reviews</p>
              </a>
              <a href="/">
                <p>About</p>
              </a>
            </div>
          </header>

          <Routes>
            <Route exact path="/" element={<Search />} />
            <Route path="/movie/:movieID" element={<Movie />} />
            <Route path="/actor/:actorID" element={<Actor />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="*" element={<p> 404 </p>} status={404}/>
          </Routes>
        </div>
      </Router>
  );
}

export default App;
