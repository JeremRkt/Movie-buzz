//API constants
const API_KEY = "6e5107aef2ad1f8cf3191a841efd735a";
const API_URL = "https://api.themoviedb.org/3"

//Builds a valid query to fetch with js fetch()
//Args:
//endpoint (ex: /search/movie)
//params (ex: {"query" : "Fight Club", "page": 1})
export function constructQuery(endpoint, params) {
    let result = API_URL + endpoint + "?";
    Object.keys(params).forEach(key => {
        result += key + "=" + params[key] + "&";
    });
    result += "api_key=" + API_KEY;
    return result;
}