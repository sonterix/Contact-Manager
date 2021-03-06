import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import Mailto from 'react-protected-mailto'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as solidStar, faTrash, faUserEdit } from '@fortawesome/free-solid-svg-icons'
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons'
import ConfirmAlert from 'components/UI/ConfirmAlert/ConfirmAlert'
import noavatar from 'assets/images/noavatar.png'
import styles from './ContactDetails.module.scss'

const ContactDetails = ({ computedMatch, users, toggleFavorite, updateUser, deleteUser }) => {
  const { goBack } = useHistory()

  const [ editMode, setEditMode ] = useState(false)
  const [ confirmPopup, setConfirmPopup ] = useState(false)

  const firstNameInput = useRef()
  const lastNameInput = useRef()
  const descriptionInput = useRef()

  const { params: { userId = 1 } = {} } = computedMatch
  const user = users.find(({ id }) => id === +userId)

  if (!user) {
    goBack()
    return null
  }

  const { id, avatar = null, email, first_name, last_name, description, favorite } = user

  const handleUpdateUser = () => {
    const updatedUser = {
      ...user,
      first_name: firstNameInput.current.value,
      last_name: lastNameInput.current.value,
      description: descriptionInput.current.value
    }

    updateUser(updatedUser)
    setEditMode(false)
  }

  return (
    <>
      { confirmPopup 
        && <ConfirmAlert
            submitBtn="Delete"
            submitFunc={ () => deleteUser(id) }
            cancelFunc={ () => setConfirmPopup(false) }
          />
      }
      
      <div className="wrapper-sm">
        <div className={ styles.UserCard }>

          <div className={ styles.Actions }>
            <button className={ styles.UserFavorite } onClick={ () => toggleFavorite(id) }>
              <FontAwesomeIcon icon={ favorite ? solidStar : regularStar } />
            </button>
            <button className={ styles.UserEdit } onClick={ () => setEditMode(true) } disabled={ editMode }>
              <FontAwesomeIcon icon={ faUserEdit } />
            </button>
            <button className={ styles.UserDelete } onClick={ () => setConfirmPopup(true) }>
              <FontAwesomeIcon icon={ faTrash } />
            </button>
          </div>

          
          <div className={ styles.UserAvatar }>
            { avatar
              ? <img src={ avatar } alt="avatar" />
              : <img src={ noavatar } alt="avatar" />
            }
          </div>

          <div className={ styles.UserName }>
            { editMode 
              ? <>
                  <input type="text" ref={ firstNameInput } defaultValue={ first_name } autoFocus={ true }  />
                  <input type="text" ref={ lastNameInput } defaultValue={ last_name }  />
                </>
              : <> { first_name } { last_name } </>
            }
          </div>

          <div className={ styles.UserEmail }>
            <Mailto
              email={ email }
              headers={
                { subject:'Question from the Contact Manager App' }
              }
            >{ email }</Mailto>
          </div>

          <div className={ styles.UserDescription }>
            { editMode
              ? <textarea ref={ descriptionInput } defaultValue={ description } rows="5" />
              : description
            }
          </div>

          { editMode 
            && <div className={ styles.EditActions }>
              <button className={ styles.Save } onClick={ () => handleUpdateUser() }>Save</button>
              <button className={ styles.Cancel } onClick={ () => setEditMode(false) }>Cancel</button>
            </div>
          }
        </div>
      </div>
    </>
  )
}

ContactDetails.propTypes = {
  users: PropTypes.array,
  toggleFavorite: PropTypes.func,
  updatedUser: PropTypes.func,
  deleteUser: PropTypes.func
}

ContactDetails.defaultProps = {
  users: [],
  toggleFavorite: () => {},
  updatedUser: () => {},
  deleteUser: () => {}
}

export default ContactDetails
