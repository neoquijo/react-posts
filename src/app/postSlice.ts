import { createSlice } from "@reduxjs/toolkit";


interface IQuery {
    query: string
}

const initialState: IQuery = {
    query: ''
}

const postSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setQuery: (state, { payload }) => {
            state.query = payload
        }
    }

})

export default postSlice.reducer
export const { setQuery } = postSlice.actions