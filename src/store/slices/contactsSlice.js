import { createSlice } from "@reduxjs/toolkit"
import uuid from 'uuid-int'
import { API_URL, API_USERS, API_PAGE, splitUsers } from 'helpers.js'
import { setAlertAction, unsetAlertAction, loadingOnAction, loadingOffAction } from "./appSlice"

const initialState = {
  users: [],
  usersPerPage: [],
  sorted: {
    byFavorite: false,
    byName: false,
    byChecked: false
  },
  buttons: {
    deleteSelectedButton: false
  },
  perPage: 6
}

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: initialState,
  reducers: {
    setPerPage: (state, { payload }) => {
      state.perPage = payload
      state.usersPerPage = splitUsers(state.users, state.perPage)
    },
    setUsers: (state, { payload }) => {
      state.users = payload
      state.usersPerPage = splitUsers(state.users, state.perPage)
    },
    putUser: (state, { payload }) => {
      const newUser = { ...payload, id: uuid(20).uuid(), favorite: false, checked: false, }
      state.users.unshift(newUser)
      state.usersPerPage = splitUsers(state.users, state.perPage)
    },
    updateUser: (state, { payload }) => {
      state.users = state.users.map(user => user.id === payload.id ? { ...payload } : user)
      state.usersPerPage = splitUsers(state.users, state.perPage)
    },
    toggleFavorite: (state, { payload }) => {
      state.users = state.users.map(user => user.id === payload ? { ...user, favorite: !user.favorite } : user)
      state.usersPerPage = splitUsers(state.users, state.perPage)
    },
    toggleCheck: (state, { payload }) => {
      state.users = state.usersPerPage.reduce((accumulator, chunk) =>  [ ...accumulator, ...chunk ], [])
      state.users = state.users.map(user => user.id === payload ? { ...user, checked: !user.checked } : user)
      state.buttons.deleteSelectedButton = state.users.some(user => user.checked)
      state.usersPerPage = splitUsers(state.users, state.perPage)
    },
    sortByFavorite: state => {
      const favorites = state.users.some(user => user.favorite)

      if (favorites) {
        if (state.sorted.byFavorite) {
          state.users = state.users.sort(({ favorite: aFavorive }, { favorite: bFavorive }) => aFavorive > bFavorive ? 1 : -1)
          state.sorted.byFavorite = !state.sorted.byFavorite
          state.usersPerPage = splitUsers(state.users, state.perPage)
        } else {
          state.users = state.users.sort(({ favorite: aFavorive }, { favorite: bFavorive }) => aFavorive < bFavorive ? 1 : -1)
          state.sorted.byFavorite = !state.sorted.byFavorite
          state.usersPerPage = splitUsers(state.users, state.perPage)
        }
      }
    },
    sortByName: state => {
      if (state.sorted.byName) {
        state.users = state.users.sort(({ first_name: aName }, { first_name: bName }) => aName < bName ? 1 : -1)
        state.sorted.byName = !state.sorted.byName
        state.usersPerPage = splitUsers(state.users, state.perPage)
      } else {
        state.users = state.users.sort(({ first_name: aName }, { first_name: bName }) => aName > bName ? 1 : -1)
        state.sorted.byName = !state.sorted.byName
        state.usersPerPage = splitUsers(state.users, state.perPage)
      }
    },
    sortByChecked: (state, { payload }) => {
      const currentPage = state.usersPerPage[payload]
      const checked = currentPage.some(user => user.checked)
    
      if (checked) {
        if (state.sorted.byChecked) {
          state.usersPerPage[payload] = currentPage.sort(({ checked: aChecked }, { checked: bChecked }) => aChecked > bChecked ? 1 : -1)
          state.sorted.byChecked = !state.sorted.byChecked
        } else {
          state.usersPerPage[payload] = currentPage.sort(({ checked: aChecked }, { checked: bChecked }) => aChecked < bChecked ? 1 : -1)
          state.sorted.byChecked = !state.sorted.byChecked
        }
      }
    },
    clearSelected: state => {
      state.users = state.users.map(user => ({ ...user, checked: false }))
      state.usersPerPage = splitUsers(state.users, state.perPage)
      state.buttons.deleteSelectedButton = false
    },
    deleteUser: (state, { payload }) => {
      state.users = state.users.filter(user => user.id !== payload)
      state.usersPerPage = splitUsers(state.users, state.perPage)
    },
    deleteSelected: state => {
      state.users = state.users.filter(user => user.checked === false)
      state.usersPerPage = splitUsers(state.users, state.perPage)
      state.buttons.deleteSelectedButton = false
    }
  }
})

contactsSlice.actions.getUsers = () => async dispatch => {
  dispatch(loadingOnAction())

  try {
    const response = await fetch(`${ API_URL }${ API_USERS }${ API_PAGE }`)
    const { data } = await response.json()
    const users = data.map(user => ({
      ...user,
      favorite: false,
      checked: false,
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui dolor exercitationem similique sed voluptatem consequatur sapiente repellendus ipsa recusandae laudantium.'
    }))

    dispatch(loadingOffAction())
    dispatch(setUsersAction(users))
  } catch {
    dispatch(loadingOffAction())
    dispatch(setAlertAction('Error with fetching data from API'))
    setTimeout(() => dispatch(unsetAlertAction()), 4000)
  }
}

contactsSlice.actions.postUpdatedUser = () => async dispatch => {
  // fake update users on backend
  dispatch(loadingOnAction())

  const response = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 'updated' })
    }, 200)
  })

  await response
  
  dispatch(loadingOffAction())
}

export const {
  setPerPage: setPerPageAction,
  setUsers: setUsersAction,
  getUsers: getUsersAction,
  updateUser: updateUserAction,
  putUser: putUserAction,
  postUpdatedUser: postUpdatedUserAction,
  toggleFavorite: toggleFavoriteAction,
  toggleCheck: toggleCheckAction,
  sortByFavorite: sortByFavoriteAction,
  sortByName: sortByNameAction,
  sortByChecked: sortByCheckedAction,
  clearSelected: clearSelectedAction,
  deleteUser: deleteUserAction,
  deleteSelected: deleteSelectedAction
} = contactsSlice.actions

export default contactsSlice