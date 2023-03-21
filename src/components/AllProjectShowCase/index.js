import Loader from 'react-loader-spinner'
import './index.css'
import {Component} from 'react'

import Items from '../Items'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatus = {
  initial: 'INITIAL',
  sucess: 'SUCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllProjectShowCase extends Component {
  state = {
    activeCategory: categoriesList[0].id,
    apiStatusConst: apiStatus.initial,
    productsList: [],
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({apiStatusConst: apiStatus.inProgress})

    const {activeCategory} = this.state

    const url = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    console.log(url)

    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const fetchData = await response.json()

      const updatedData = fetchData.projects.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        name: each.name,
      }))
      console.log(updatedData)
      this.setState({
        productsList: updatedData,
        apiStatusConst: apiStatus.sucess,
      })
    } else {
      this.setState({
        apiStatusConst: apiStatus.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader
        type="ThreeDots"
        data-testid="loader"
        color="#0b69ff"
        height="50"
        width="50"
      />
    </div>
  )

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png "
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button"> Retry</button>
    </div>
  )

  renderProductsView = () => {
    const {productsList} = this.state
    const value = productsList.length > 0

    return value ? (
      <div className="productsList">
        <ul className="unorder-list">
          {productsList.map(each => (
            <Items details={each} key={each.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="products-error-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png "
          alt="products failure"
          className="products-failure-img"
        />
        <h1 className="product-failure-heading-text">
          Oops! Something Went Wrong
        </h1>
        <p className="products-failure-description">
          We cannot seem to find the page you are looking for.
        </p>
      </div>
    )
  }

  renderAllProductsView = () => {
    const {apiStatusConst} = this.state

    switch (apiStatusConst) {
      case apiStatus.sucess:
        return this.renderProductsView()
      case apiStatus.inProgress:
        return this.renderLoadingView()
      case apiStatus.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  onChangeCategory = event => {
    this.setState(
      {activeCategory: event.target.value.toUpperCase()},
      this.getProducts,
    )
  }

  render() {
    const {activeCategory, apiStatusConst} = this.state
    console.log(activeCategory, apiStatusConst)
    console.log(this.renderAllProductsView())

    return (
      <div className="main-section">
        <select
          className="select"
          value={activeCategory}
          onChange={this.onChangeCategory}
        >
          {categoriesList.map(each => (
            <option key={each.id} value={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
        {this.renderAllProductsView()}
      </div>
    )
  }
}

export default AllProjectShowCase
