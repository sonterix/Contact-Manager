import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  users: [],
  sorted: {
    byFavorite: false,
    byName: false,
    byChecked: false
  },
  buttons: {
    deleteSelectedButton: false
  },
  totalPages: 1
}

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: initialState,
  reducers: {
    setUsers: (state, { payload: { users, total_pages } }) => {
      state.users = users
      state.totalPages = total_pages
    },
    toggleFavorite: (state, { payload }) => {
      state.users = state.users.map(user => user.id === payload ? { ...user, favorite: !user.favorite } : user)
    },
    toggleCheck: (state, { payload }) => {
      state.users = state.users.map(user => user.id === payload ? { ...user, checked: !user.checked } : user)
      state.buttons.deleteSelectedButton = state.users.some(user => user.checked)
    },
    sortByFavorite: state => {
      const favorites = state.users.some(user => user.favorite)

      if (favorites) {
        if (state.sorted.byFavorite) {
          state.users = state.users.sort(({ favorite: aFavorive }, { favorite: bFavorive }) => aFavorive > bFavorive ? 1 : -1)
          state.sorted.byFavorite = !state.sorted.byFavorite
        } else {
          state.users = state.users.sort(({ favorite: aFavorive }, { favorite: bFavorive }) => aFavorive < bFavorive ? 1 : -1)
          state.sorted.byFavorite = !state.sorted.byFavorite
        }
      }
    },
    sortByName: state => {
      if (state.sorted.byName) {
        state.users = state.users.sort(({ first_name: aName }, { first_name: bName }) => aName < bName ? 1 : -1)
        state.sorted.byName = !state.sorted.byName
      } else {
        state.users = state.users.sort(({ first_name: aName }, { first_name: bName }) => aName > bName ? 1 : -1)
        state.sorted.byName = !state.sorted.byName
      }
    },
    sortByChecked: state => {
      const checked = state.users.some(user => user.checked)

      if (checked) {
        if (state.sorted.byChecked) {
          state.users = state.users.sort(({ checked: aChecked }, { checked: bChecked }) => aChecked > bChecked ? 1 : -1)
          state.sorted.byChecked = !state.sorted.byChecked
        } else {
          state.users = state.users.sort(({ checked: aChecked }, { checked: bChecked }) => aChecked < bChecked ? 1 : -1)
          state.sorted.byChecked = !state.sorted.byChecked
        }
      }
    },
    deleteUser: (state, { payload }) => {
      state.users = state.users.filter(user => user.id !== payload)
    },
    deleteSelected: state => {
      state.users = state.users.filter(user => user.checked === false)
    }
  }
})

export const {
  setUsers: setUsersAction,
  toggleFavorite: toggleFavoriteAction,
  toggleCheck: toggleCheckAction,
  sortByFavorite: sortByFavoriteAction,
  sortByName: sortByNameAction,
  sortByChecked: sortByCheckedAction,
  deleteUser: deleteUserAction,
  deleteSelected: deleteSelectedAction
} = contactsSlice.actions

export default contactsSlice