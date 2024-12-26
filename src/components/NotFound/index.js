import {Link} from 'react-router-dom'

import './index.css'

const NotFound = () => (
  <>
    <div className="not-found-container">
      <div className="not-found-videos-view">
        <h1 className="not-found-videos-heading">Lost Your Way ?</h1>
        <p className="not-found-videos-note">
          we are sorry, the page you requested could not be found Please go back
          to the homepage.
        </p>
        <Link className="nav-link" to="/">
          <button className="not-found-comp-btn" type="button">
            Go To Home
          </button>
        </Link>
      </div>
    </div>
  </>
)

export default NotFound
