
import { createSlice } from '@reduxjs/toolkit';

const initialState= {
    currentPost: null,
    allPost:[],
    loading: false,
    error: null,
}
const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPostLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setPostSuccess: (state, action) => {
      state.loading = false;
      state.currentPost = action.payload;
    },
    setAllPostSuccess:(state,action)=>{
        state.allPost=action.payload;
    },
    setPostError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deletePostSuccess: (state, action) => {
      state.allPost = state.allPost.filter(post => post.id !== action.payload);
      state.currentPost=null;
    },
    // clearPost: (state) => {
    //   state.currentPost = null;
    // },
  },
});

export const { setPostLoading, setPostSuccess, setAllPostSuccess, setPostError, clearPost,deletePostSuccess } = postSlice.actions;
export default postSlice.reducer;
