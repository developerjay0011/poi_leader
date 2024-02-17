import { configureStore } from '@reduxjs/toolkit'
import { uiSlice } from './UI/uiSlice'
import { postSlice } from './posts/postSlice'
import { agendaSlice } from './agenda/agendaSlice'
import { authSlice } from './auth/authSlice'
import { commonSlice } from './common/commonSlice'
import { leaderSlice } from './leader/leaderSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    common: commonSlice.reducer,
    leader: leaderSlice.reducer,
    UI: uiSlice.reducer,
    posts: postSlice.reducer,
    agenda: agendaSlice.reducer,
  },
})

// types to configure custom useSelector and useDispatch hooks for better auto compeletion through TS
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// to get the redux store data outside of react component
export const getReduxStoreValues = store.getState
