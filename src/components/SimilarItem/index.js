import {Link, withRouter} from 'react-router-dom'
import './index.css'

const SimilarItem = props => {
  const {similarList, logMovie} = props
  const {id, title, backdrop} = similarList
  const getMovie = () => {
    logMovie()
  }

  return (
    <Link to={`/movies/${id}`} className="link2" onClick={getMovie}>
      <li className="list">
        <img src={backdrop} className="similarPic" alt={title} />
      </li>
    </Link>
  )
}

export default withRouter(SimilarItem)
