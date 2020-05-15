// API
const API_URL = 'https://reqres.in/'
const API_LOGIN = 'api/login'

// Auth
export const auth = async data => {
  try {
    const response = await fetch(`${ API_URL }${ API_LOGIN }`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    const { token = null, error = null } = await response.json()

    if (token) setLoginLS(token, data.email)

    return { token, error }
  } catch {
    return { error: 'Error with fetching data from the API' }
  }
}

export const setLoginLS = (token, user) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user', user)
}

export const setLogoutLS = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// Nav
export const NAV_ITEMS = {
  userLogin: [
    { id: 1, path: '/', name: 'Home' },
    { id: 2, path: '/contacts', name: 'Contacts' },
    { id: 3, path: '/logout', name: 'Logout' }
  ],
  userLogout: [
    { id: 1, path: '/', name: 'Home' },
    { id: 2, path: '/login', name: 'Login' }
  ]
}