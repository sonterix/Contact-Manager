import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { loadBody } from 'helpers'
import Header from 'containers/Header/HeaderContainer'
import Loading from 'components/UI/Loading/Loading'
import Alert from 'components/UI/Alert/Alert'
import ThemeSwitcher from 'components/UI/ThemeSwitcher/ThemeSwitcher'

const App = ({ children, checkUser, loading, alertMessage: { status: alertStatus, message: alertMessage } }) => {
  useEffect(() => {
    (async () => {
      const user = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      await checkUser(user, token)
      loadBody()
    })()
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <Header />
      { children }
      
      <ThemeSwitcher />
      { loading && <Loading /> }
      { alertStatus && <Alert message={ alertMessage } /> }
    </>
  )
}

App.propTypes = {
  checkUser: PropTypes.func,
  loading: PropTypes.bool
}

App.defaultProps = {
  checkUser: () => {},
  loading: false
}

export default App
