import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    
    toggleConfirm:false,
}

const ToggleConfirmSlice = createSlice({
    name: "toggleconfirm",
    initialState,
    reducers: {
        
        ToggleConfirmModal: (state, action)=>{
            console.log("Toggle Confirm", action)
            state.toggleConfirm = !state.toggleConfirm;
        }
    }
});

export const {
    ToggleConfirmModal
} = ToggleConfirmSlice.actions



export default ToggleConfirmSlice.reducer