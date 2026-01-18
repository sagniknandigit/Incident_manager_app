import {createSlice,PayloadAction} from '@reduxjs/toolkit';

interface User{
  id:number;
  name:string;
  role:'REPORTER'|'ENGINEER'|'MANAGER';
}

interface AuthState{
  user:User|null;
  token:string|null;
  isAuthenicated:boolean;
}

const initialState:AuthState={
  user:null,
  token:null,
  isAuthenicated:false,
};

const authSlice=createSlice({
  name:'auth',
  initialState,
  reducers:{
    loginSuccess(state,action:PayloadAction<{user:User;token:string}>)
    {
      state.user=action.payload.user;  
      state.token=action.payload.token;
      state.isAuthenicated=true;
    },
    logout(state){
      state.user=null;
      state.token=null;
      state.isAuthenicated=false;
    },
  },
});

export const {loginSuccess,logout}=authSlice.actions;
export default authSlice.reducer;