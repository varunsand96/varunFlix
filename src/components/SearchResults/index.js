import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import FailureView from '../FailureView'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class SearchFilter extends Component {
  state = {
    searchInput: '',
    searchMovies: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getSearchMovies()
  }

  getSearchMovies = async () => {
    const {searchInput} = this.state

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('varun')
    const apiUrl = `https://apis.ccbp.in/movies-app/movies-search?search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const updatedData = data.results.map(each => ({
        posterPath: each.poster_path,
        title: each.title,
        id: each.id,
        backdropPath: each.backdrop_path,
      }))
      this.setState({
        searchMovies: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  searchInput = text => {
    this.setState(
      {
        searchInput: text,
      },
      this.getSearchMovies, // Trigger search after input change
    )
  }

  onRetry = () => {
    this.getSearchMovies()
  }

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="TailSpin" height={35} width={380} color="#D81F26" />
    </div>
  )

  renderNotfoundMovies = () => {
    const {searchInput} = this.state
    return (
      <div className="search-heading-container">
        <img
          src="https://res.cloudinary.com/dyx9u0bif/image/upload/v1657092588/Group_7394_jzwy1v.png"
          alt="no movies"
          className="search-not-found-image"
        />
        <h1 className="search-not-found-heading">
          Your search for "{searchInput}" did not find any matches.
        </h1>
      </div>
    )
  }

  renderResultsView = () => {
    const {searchMovies} = this.state
    return (
      <div className="search-filter-bg-container">
        <div className="search-filter-movies-list-container">
          <ul className="search-filter-ul-container">
            {searchMovies.length > 0
              ? searchMovies.map(each => (
                  <Link to={`/movies/${each.id}`} key={each.id}>
                    <li className="search-filter-li-item">
                      <img
                        className="search-poster"
                        src={each.posterPath}
                        alt={each.title}
                      />
                    </li>
                  </Link>
                ))
              : this.renderNotfoundMovies()}
          </ul>
        </div>
        <Footer />
      </div>
    )
  }

  renderSuccessView = () => {
    const {searchInput} = this.state
    if (searchInput === '') {
      return (
        <div className="search-filter-initial-no-search">
          <p className="empty-text">
            Search for movies by typing in the search bar
          </p>
        </div>
      )
    }
    return this.renderResultsView()
  }

  onRetry = () => {
    this.getSearchMovies()
  }

  renderFailureView = () => <FailureView onRetry={this.onRetry} />

  renderSearchMovies = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="search-filter-bg-container">
        <Header searchInput={this.searchInput} />
        <div className="renderCenter">{this.renderSearchMovies()}</div>
      </div>
    )
  }
}

export default SearchFilter
