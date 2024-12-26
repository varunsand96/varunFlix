import {Switch, Route, BrowserRouter, Redirect} from 'react-router-dom'
import './App.css'
import LoginPage from './components/LoginPage'
import Home from './components/Home'
import Popular from './components/Popular'
import MovieItem from './components/MovieItem'
import SearchResults from './components/SearchResults'
import NotFound from './components/NotFound'
import Account from './components/Account'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={LoginPage} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/popular" component={Popular} />
      <ProtectedRoute exact path="/movies/:id" component={MovieItem} />
      <ProtectedRoute path="/search" component={SearchResults} />
      <ProtectedRoute path="/account" component={Account} />
      <Route path="/not-found" component={NotFound} />
      <Redirect to="not-found" />
    </Switch>
  </BrowserRouter>
)

export default App
