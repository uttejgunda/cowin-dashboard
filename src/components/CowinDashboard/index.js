import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inprogress: 'IN PROGRESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {data: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.inprogress})

    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        vaccinationCoverage: data.last_7_days_vaccination,
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }
      console.log(data)
      this.setState({data: updatedData, apiStatus: apiStatusConstants.success})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderVaccinationCoverage = () => {
    const {data} = this.state
    const coverageData = data.vaccinationCoverage
    console.log(data)
    return <VaccinationCoverage data={coverageData} />
  }

  renderVaccinationByGender = () => {
    const {data} = this.state
    const coverageData = data.vaccinationByGender
    return <VaccinationByGender data={coverageData} />
  }

  renderVaccinationByAge = () => {
    const {data} = this.state
    const coverageData = data.vaccinationByAge
    return <VaccinationByAge data={coverageData} />
  }

  renderSuccessView = () => (
    <>
      {this.renderVaccinationCoverage()}
      {this.renderVaccinationByGender()}
      {this.renderVaccinationByAge()} )
    </>
  )

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader width={80} height={80} type="ThreeDots" color="#ffffff" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-msg">Something went wrong</h1>
    </div>
  )

  renderSwitch = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inprogress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <div className="content-container">
          <div className="logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
              className="logo-image"
            />
            <h1 className="logo-title">Co-WIN</h1>
          </div>
          <h1 className="desc">CoWIN Vaccination in India</h1>
          {this.renderSwitch()}
        </div>
      </div>
    )
  }
}
export default CowinDashboard
