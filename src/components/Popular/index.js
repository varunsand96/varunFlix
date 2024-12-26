import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

import Footer from '../Footer'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Popular extends Component {
  state = {popularList: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getPopular()
  }

  getPopular = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('varun')
    const url = 'https://apis.ccbp.in/movies-app/popular-movies'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const moviesdata = data.results.map(each => ({
        id: each.id,
        backdropImg: each.backdrop_path,
        title: each.title,
        poster: each.poster_path,
      }))

      this.setState({
        popularList: moviesdata,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.state({apiStatus: apiStatusConstants.failure})
    }
  }

  onSuccess = () => {
    const {popularList} = this.state
    return (
      <div>
        <ul className="slick-item2">
          {popularList.map(each => (
            <Link to={`/movies/${each.id}`} key={each.id}>
              <li className="list2">
                <img
                  src={each.backdropImg}
                  className="imgPop"
                  alt={each.title}
                />
              </li>
            </Link>
          ))}
        </ul>

        <Footer />
      </div>
    )
  }

  onLoading = () => (
    <div className="loader-container3" data-testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  tryAgainBtn = () => {
    this.getPopular()
  }

  onFailure = () => (
    <div className="tryAgainCon">
      <img
        src="https://res.cloudinary.com/ddwlhht4h/image/upload/v1734758702/Group_1_m9evgh.png"
        alt="falure"
      />
      <p className="failpara">Something went wrong. Please try again</p>
      <button className="tryAgain" type="button" onClick={this.tryAgainBtn}>
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
    return (
      <div className="popularCon">
        <div className="overlay">
          <Header />
        </div>
        <div className="flexPop">{this.renderMovies()}</div>
      </div>
    )
  }
}

export default Popular
