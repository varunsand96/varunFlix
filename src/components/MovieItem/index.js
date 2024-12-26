import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'
import SimilarItem from '../SimilarItem'
import Footer from '../Footer'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class MovieItem extends Component {
  state = {
    movie: {},
    similarMovieList: [],
    apiStatus: apiStatusConstants.initial,
    genreList: [],
    audioList: [],
  }

  componentDidMount() {
    this.getMovieItem()
  }

  getMovieItem = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('varun')
    const url = `https://apis.ccbp.in/movies-app/movies/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const movieItem = {
        isAdult: data.movie_details.adult,
        backdrop: data.movie_details.backdrop_path,
        budget: data.movie_details.budget,
        id: data.movie_details.id,
        runtime: data.movie_details.runtime,
        overview: data.movie_details.overview,
        poster_path: data.movie_details.poster_path,
        releaseDate: data.movie_details.release_date,
        title: data.movie_details.title,
        voteCount: data.movie_details.vote_count,
        voteAverage: data.movie_details.vote_average,
      }
      const audio = data.movie_details.spoken_languages.map(each => ({
        id: each.id,
        name: each.english_name,
      }))
      const genre = data.movie_details.genres.map(each => ({
        id: each.id,
        name: each.name,
      }))

      const similarMovies = data.movie_details.similar_movies.map(each => ({
        id: each.id,
        title: each.title,
        backdrop: each.backdrop_path,
        poster: each.poster_path,
      }))

      this.setState({
        apiStatus: apiStatusConstants.success,
        similarMovieList: similarMovies,
        movie: movieItem,
        genreList: genre,
        audioList: audio,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  convertMinutesToHours = minutes => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60 // Calculate the remaining minutes
    return `${hours}h ${remainingMinutes}h`
  }

  extractYear = dateString => {
    const date = new Date(dateString) // Create a Date object from the string
    return date.getFullYear() // Extract the year
  }

  logMovie = () => {
    this.getMovieItem()
  }

  onSuccess = () => {
    const {movie, genreList, audioList, similarMovieList} = this.state
    const minutes = this.convertMinutesToHours(parseInt(movie.runtime))
    const year = this.extractYear(movie.releaseDate)

    return (
      <div className="movieItemCon">
        <div className="overlay">
          <Header />
        </div>
        <div className="imgCon2">
          <img src={movie.backdrop} className="movieLogo2" alt="logo" />

          <div className="onOver">
            <p className="runtime">{minutes}</p>
            {movie.isAdult ? (
              <p className="adult">A</p>
            ) : (
              <p className="adult">U/A</p>
            )}
            <p className="release">{year}</p>
          </div>
          <p className="para2">{movie.overview}</p>
          <h1 className="name">{movie.title}</h1>
          <button className="play" type="button">
            Play
          </button>
        </div>
        <div className="downCon">
          <div className="cardItem">
            <p className="genrePara">Genres</p>
            <ul>
              {genreList.map(each => (
                <li key={each.id} className="listGen">
                  {each.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="cardItem">
            <p className="genrePara">Audio Available</p>
            <ul>
              {audioList.map(each => (
                <li key={each.id} className="listGen">
                  {each.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="cardItem">
            <p className="genrePara">Rating Count</p>
            <p className="votePara">{movie.voteCount}</p>
            <div>
              <p className="genrePara">Rating Average</p>
              <p className="votePara">{movie.voteAverage}</p>
            </div>
          </div>

          <div className="cardItem">
            <p className="genrePara">Budget</p>
            <p className="votePara">{movie.budget}</p>
            <div>
              <p className="genrePara">Release Date</p>
              <p className="votePara">{movie.releaseDate}</p>
            </div>
          </div>
        </div>
        <div className="similar">
          <p className="moreHead">More like this</p>
          <ul className="similarFlex">
            {similarMovieList.map(each => (
              <SimilarItem
                similarList={each}
                key={each.id}
                logMovie={this.logMovie}
              />
            ))}
          </ul>
        </div>
        <Footer />
      </div>
    )
  }

  onLoading = () => (
    <div className="loader-container2" data-testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  tryAgainBtn = () => {
    this.getMovieItem()
  }

  onFailure = () => (
    <div className="tryAgainCon">
      <img
        src="https://res.cloudinary.com/ddwlhht4h/image/upload/v1734758702/Group_1_m9evgh.png"
        alt="falure"
      />
      <p className="failpara">Something went wrong. Please try again</p>
      <button className="tryAgain" onClick={this.tryAgainBtn} type="button">
        {' '}
        Try Again
      </button>
    </div>
  )

  renderMovies = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onSuccess()
      case apiStatusConstants.inProgress:
        return this.onLoading()
      case apiStatusConstants.failure:
        return this.onFailure()
      default:
        return null
    }
  }

  render() {
    const {movie} = this.state
    console.log(movie.genre)

    return <div className="bggCon">{this.renderMovies()}</div>
  }
}

export default MovieItem
