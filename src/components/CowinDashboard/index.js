import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstant = {
  pending: 'PENDING',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initialy: 'INITIALY',
}

class CowinDashboard extends Component {
  state = {data: [], apiStatus: apiStatusConstant.initialy}

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusConstant.pending})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok === true) {
      const formattedData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }
      this.setState({data: formattedData, apiStatus: apiStatusConstant.success})
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  renderPycharts = () => {
    const {data} = this.state
    const {last7DaysVaccination, vaccinationByGender, vaccinationByAge} = data
    return (
      <>
        <VaccinationCoverage VaccinationData={last7DaysVaccination} />
        <VaccinationByGender vaccinationByGenderData={vaccinationByGender} />
        <VaccinationByAge vaccinationByAgeData={vaccinationByAge} />
      </>
    )
  }

  renderFailure = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
      />
      <h1 className="failure-heading">Something Went Wrong</h1>
    </div>
  )

  switchcaseCheck = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderPycharts()
      case apiStatusConstant.pending:
        return this.renderLoader()
      case apiStatusConstant.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  renderLoader = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  render() {
    return (
      <div className="bg-container">
        <div className="header-container">
          <img
            className="logo"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          />
          <h1 className="heading">Co-WIN</h1>
        </div>
        <h1 className="page-heading">CoWIN Vaccination in India</h1>
        <div className="chats-container">{this.switchcaseCheck()}</div>
      </div>
    )
  }
}

export default CowinDashboard
