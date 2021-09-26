import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    toggleModalState : false,
}

const ToggleModalSlice = createSlice({
    name: "togglemodal",
    initialState,
    reducers: {
        ToggleModalAction : (state ,action) =>{


          console.log("Action",action)
          console.log("toggle State",state.toggleModalState)
             state.toggleModalState = !state.toggleModalState;
             
        }
    }
});

export const {
    ToggleModalAction
} = ToggleModalSlice.actions



export default ToggleModalSlice.reducer