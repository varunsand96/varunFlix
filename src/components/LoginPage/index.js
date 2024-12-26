import {Component} from 'react'
import './index.css'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

class LoginPage extends Component {
  state = {username: '', password: '', errorMsg: ' ', showError: false}

  getUsername = event => {
    this.setState({username: event.target.value})
  }

  getPassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    const {username, password} = this.state
    Cookies.set('varun', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
    localStorage.setItem('username', username)
    localStorage.setItem('password', password)
  }

  onSubmitFailure = errorMsg => {
    this.setState({
      errorMsg,
      showError: true,
      username: '',
      password: '',
    })
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {showError, errorMsg, username, password} = this.state
    const jwtToken = Cookies.get('varun')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bg-con">
        <h1 className="title">Movies</h1>
        <div className="loginForm">
          <div>
            <p className="login">Login</p>
            <form onSubmit={this.submitForm}>
              <div className="inputCard">
                <label htmlFor="username" className="labeled">
                  USERNAME
                </label>
                <br />
                <input
                  type="text"
                  id="username"
                  className="text"
                  onChange={this.getUsername}
                  value={username}
                />
              </div>
              <div className="inputCard">
                <label htmlFor="password" className="labeled">
                  PASSWORD
                </label>
                <br />
                <input
                  type="password"
                  id="password"
                  className="text"
                  onChange={this.getPassword}
                  value={password}
                />
              </div>
              {showError && <p className="errorPara">{errorMsg}</p>}
              <button type="submit" className="loginBtn">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginPage
