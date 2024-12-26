import {Link, withRouter} from 'react-router-dom'
import {HiOutlineSearch} from 'react-icons/hi'
import {Component} from 'react'
import {MdMenuOpen} from 'react-icons/md'
import {ImCross} from 'react-icons/im'
import './index.css'

class Header extends Component {
  state = {showSearchBar: false, showMenu: false}

  onClickSearchIcon = () => {
    this.setState(prevState => ({
      showSearchBar: !prevState.showSearchBar,
    }))
  }

  onChangeSearchInput = event => {
    const {searchInput} = this.props
    if (event.key === 'Enter') {
      searchInput(event.target.value)
    }
  }

  redirectTosearch = () => {
    const {history} = this.props
    history.replace('/search')
  }

  onClickShowMenu = () => {
    this.setState({showMenu: true})
  }

  onClickHideMenu = () => {
    this.setState({showMenu: false})
  }

  render() {
    const {showSearchBar, showMenu} = this.state
    const {match} = this.props
    const {path} = match
    const addClass = path === '/' && 'home'
    const addClass2 = path === '/popular' && 'popular'

    const addClass3 = path === '/account' && 'popular'

    const navClass = path === '/popular' ? 'navbar2' : 'navbar'
    return (
      <nav className={`${navClass}`}>
        <div className="textFlex">
          <Link to="/" className="link">
            <h1 className="title">Movies</h1>
          </Link>
          <ul className="listType">
            <Link to="/" className="link">
              <li className={`list-item ${addClass}`}>Home</li>
            </Link>
            <Link to="/popular" className="link">
              <li className={`list-item ${addClass2}`}>Popular</li>
            </Link>
          </ul>
        </div>
        <div className="btnFlex">
          <div className="searchCon">
            {showSearchBar && (
              <input
                type="search"
                onKeyDown={this.onChangeSearchInput}
                placeholder="search"
                className="search"
              />
            )}
            <Link to="/search">
              <button className="searchIcon" type="button">
                <HiOutlineSearch
                  size={20}
                  color="white"
                  testid="searchButton"
                  onClick={this.onClickSearchIcon}
                />
              </button>
            </Link>
          </div>
          <Link to="/account">
            <img
              src="https://res.cloudinary.com/ddwlhht4h/image/upload/v1734543987/Avatar_oturmb.png"
              className="profile"
              alt="profile"
            />
          </Link>
          <MdMenuOpen
            size={25}
            color="white"
            className="menu-icon"
            onClick={this.onClickShowMenu}
          />
        </div>
        {showMenu && (
          <div className="menuClass">
            <ul className="list-mini">
              <Link to="/" className="nav-link">
                <li className={`list-item ${addClass}`}>Home</li>
              </Link>
              <Link to="/popular" className="nav-link">
                <li className={`list-item ${addClass2}`}>Popular</li>
              </Link>

              <Link to="/account" className="nav-link">
                <li className={`list-item ${addClass3}`}>Account</li>
              </Link>
              <ImCross
                size={10}
                color="#ffffff"
                onClick={this.onClickHideMenu}
                className="icon2"
              />
            </ul>
          </div>
        )}
      </nav>
    )
  }
}

export default withRouter(Header)
