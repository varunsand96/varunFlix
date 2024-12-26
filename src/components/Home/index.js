import {Component} from 'react'
import './index.css'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import TrendingSlick from '../TrendingSlick'
import Originals from '../Originals'
import Footer from '../Footer'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {moviesList: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getMovie()
  }

  getMovie = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('varun')

    const url = 'https://apis.ccbp.in/movies-app/trending-movies'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()

      const moviesdata = data.results.map(each => ({
        id: each.id,
        overview: each.overview,
        backdropImg: each.backdrop_path,
        title: each.title,
        poster: each.poster_path,
      }))
      this.setState({
        moviesList: moviesdata,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getRandomImage = images => {
    const randomIndex = Math.floor(Math.random() * images.length) // Generate a random index
    return images[randomIndex] // Return the image at that index
  }

  renderMovies = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onSuccess()
      case apiStatusConstants.failure:
        return this.onFailure()
      case apiStatusConstants.inProgress:
        return this.onLoading()
      default:
        return null
    }
  }

  tryAgain = () => {
    this.getMovie()
  }

  onLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  onFailure = () => (
    <div className="failCon">
      <img
        src="https://res.cloudinary.com/ddwlhht4h/image/upload/v1734598853/Icon_orowfn.png"
        alt="error view"
      />
      <p className="failurePara">Something went wrong. Please try again</p>
      <button className="failure" onClick={this.tryAgain} type="button">
        Try Again
      </button>
    </div>
  )

  onSuccess = () => {
    const {moviesList} = this.state
    const pic = this.getRandomImage(moviesList)
    let image = ''
    let name = ''
    let description = ''
    if (pic) {
      const {backdropImg, title, overview} = pic
      image = backdropImg
      name = title
      description = overview
    }
    return (
      <>
        <img src={image} className="movieLogo" alt="logo" />
        <h1 className="name">{name}</h1>
        <p className="para2">{description}</p>
        <button className="play" type="button">
          Play
        </button>
      </>
    )
  }

  render() {
    return (
      <div className="container">
        <div className="topCon">
          <div className="overlay">
            <Header />
          </div>
          <div className="imgCon">{this.renderMovies()}</div>
        </div>

        <div className="bottomCon">
          <TrendingSlick />
          <Originals />
        </div>
        <Footer />
      </div>
    )
  }
}

export default Home
