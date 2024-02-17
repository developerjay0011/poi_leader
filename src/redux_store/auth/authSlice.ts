import { deleteCookie, getCookie } from "cookies-next";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDetails } from '@/utils/typesUtils'; // Import UserDetails type
import { TOKEN_KEY } from "@/constants/common";

interface AuthState {
  userDetails: UserDetails | null;
}

let userDetails: any = getCookie("userData");
userDetails = userDetails && JSON.parse(userDetails);

const initialState: AuthState = {
  userDetails
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<UserDetails | null>) {
      state.userDetails = action.payload;
    },
    clearUserData(state) {
      state.userDetails = null;
    },
    logout(state) {
      state.userDetails = null;
      deleteCookie(TOKEN_KEY);
    }
  },
});

export const authActions = authSlice.actions;
