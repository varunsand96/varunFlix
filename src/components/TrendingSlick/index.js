import Slider from 'react-slick'
import {Component} from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class TrendingSlick extends Component {
  state = {apiStatus: apiStatusConstants.initial, moviesList: []}

  componentDidMount() {
    this.getTrending()
  }

  getTrending = async () => {
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

  renderSlider = () => {
    const {moviesList} = this.state
    return (
      <Slider {...settings}>
        {moviesList.map(eachLogo => {
          const {id, poster} = eachLogo
          return (
            <ul className="slick-item">
              <Link className="link" to={`/movies/${id}`}>
                <li className="list" key={eachLogo.id}>
                  <img className="logo-image" src={poster} alt="poster logo" />
                </li>
              </Link>
            </ul>
          )
        })}
      </Slider>
    )
  }

  onLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  tryAgain = () => {
    this.getTrending()
  }

  renderMovies = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSlider()
      case apiStatusConstants.failure:
        return this.onFailure()
      case apiStatusConstants.inProgress:
        return this.onLoading()
      default:
        return null
    }
  }

  onFailure = () => (
    <div className="failCon">
      <img
        src="https://res.cloudinary.com/ddwlhht4h/image/upload/v1734598853/Icon_orowfn.png"
        alt="error view"
      />
      <p className="failurePara">Something went wrong. Please try again</p>
      <button className="failure" type="button" onClick={this.tryAgain}>
        Try Again
      </button>
    </div>
  )

  render() {
    return (
      <div className="main-container">
        <h1 className="trending">Trending Now</h1>
        <div className="slick-container">{this.renderMovies()}</div>
      </div>
    )
  }
}

export default TrendingSlick
