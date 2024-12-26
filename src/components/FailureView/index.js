import './index.css'

const FailureView = props => {
  const {onRetry} = props
  const onClickRetry = () => {
    onRetry()
  }
  return (
    <div className="failed-view">
      <img
        className="failed-image"
        src="https://res.cloudinary.com/dyx9u0bif/image/upload/v1657426934/homepage-failure_egb8fl.png"
        alt="failure view"
      />
      <p className="failed-heading">Something went wrong. Please try again</p>
      <button className="retry-btn" type="button" onClick={onClickRetry}>
        Try Again
      </button>
    </div>
  )
}

export default FailureView
