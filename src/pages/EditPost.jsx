import React, {useEffect, useState} from 'react'
import {Container, PostForm} from '../components'
import appwriteService from "../appwrite/config";
import { useNavigate,  useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
function EditPost() {
    // const [post, setPosts] = useState(null)
    const {slug} = useParams()
    const navigate = useNavigate()
    const post=useSelector(state=>state.post.currentPost);

    useEffect(() => {
        if (!slug) {
          
            navigate('/')
        }
    }, [slug, navigate])
  return post ? (
    <div className='py-8'>
        <Container>
            <PostForm post={post} />
        </Container>
    </div>
  ) : null
}

export default EditPost