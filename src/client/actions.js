import _ from 'lodash'
import { createAction } from 'redux-actions'
import uuid from 'uuid'
import Favico from 'favico.js'

import { openChannelsSelector, getLastMessageSelector } from './selectors'

const favicon = new Favico({
  animation: 'none',
})

const noop = createAction('NOOP')

const initApp = createAction('INIT_APP')

const setVisibility = createAction('SET_VISIBILITY')

const navigated = createAction('NAVIGATED')

const openChannel = createAction('OPEN_CHANNEL')
const closeChannel = createAction('CLOSE_CHANNEL')
const setChannelName = createAction('SET_CHANNEL_NAME')

const subscribeToChannels = createAction('server/SUBSCRIBE_TO_CHANNELS')

const loadMessages = createAction('server/LOAD_MESSAGES')

const addMessage = createAction('ADD_MESSAGE')
const addMessages = createAction('ADD_MESSAGES')

const subscribeToMessages = createAction('server/SUBSCRIBE_TO_MESSAGES')

const unsubscribeFromAllMessages = createAction('UNSUBSCRIBE_FROM_ALL_MESSAGES')

const subscribeToUsers = createAction('server/SUBSCRIBE_TO_USERS')

const updateUnread = createAction('UPDATE_UNREAD')
const resetUnread = createAction('RESET_UNREAD')

const setFavicoBadge = () => (dispatch, getState) => {
  favicon.badge(getState().unread)
}

const addNotification = message => dispatch => {
  dispatch({ type: 'ADD_NOTIFICATION', payload: {
    message,
    key: uuid(),
  }})
}

const removeNotification = createAction('REMOVE_NOTIFICATION')

const reconnect = () => (dispatch, getState) => {
  const state = getState()

  dispatch(subscribeToChannels())

  const openChannels = openChannelsSelector(state)
  _.forEach(openChannels, ({ name: channelName }) => {
    const lastMessage = getLastMessageSelector(channelName)(state)

    dispatch(
      loadMessages({
        channelName,
        after: lastMessage.timestamp,
        messageId: lastMessage.id,
      })
    )
    dispatch(
      subscribeToUsers({ channelName })
    )
  })
}

export {
  noop,
  initApp,
  setVisibility,
  navigated,
  openChannel,
  closeChannel,
  setChannelName,
  subscribeToChannels,
  loadMessages,
  addMessage,
  addMessages,
  subscribeToMessages,
  unsubscribeFromAllMessages,
  subscribeToUsers,
  updateUnread,
  resetUnread,
  setFavicoBadge,
  addNotification,
  removeNotification,
  reconnect,
}
