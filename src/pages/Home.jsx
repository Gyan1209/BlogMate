import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container, PostCard} from '../components'
import { Query } from 'appwrite';
import SearchBox from '../components/SearchBox';
import { useDispatch, useSelector } from 'react-redux';
import { setAllPostSuccess, setPostError } from '../store/postSlice';

function Home() {
    // const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filteredPosts, setFilteredPosts] = useState([])
    const allPosts=useSelector(state=>state.post.allPost);
    const dispatch=useDispatch();

    useEffect(() => {
        appwriteService.getAllPosts().then((posts) => {
            
            if (posts) {
                dispatch(setAllPostSuccess(posts));
                setFilteredPosts(posts)
            }
            else{
                setPostError("No Post is there")
            }
            setLoading(false);

        })
    }, []);
    
    const handleSearch = (searchTerm) => {
        if (!searchTerm.trim()) {
            setFilteredPosts(allPosts);
            return
        }
        
        const searchTermLower = searchTerm.toLowerCase()
        const filtered = filteredPosts.filter(post =>{ 
            return post.title.toLowerCase().includes(searchTermLower)}
        )
        setFilteredPosts(filtered)
    }
  
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className='min-h-screen'>
            <Container>
                <div className="flex flex-col items-center py-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Latest Blog Posts</h1>
                    <SearchBox onSearch={handleSearch} placeholder="Search posts by title..." />
            
                </div>
                
                {filteredPosts.length === 0 ? (
                    <div className="h-[70vh] flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                No posts found
                            </h2>
                            <p className="text-gray-600">Try different search terms or check back later for new content!</p>
                        </div>
                    </div>
                ) : (
                    <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 pb-8'>
                        {filteredPosts.map((post) => (
                            <div key={post.id}>
                                <PostCard {...post} />
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    )
}

export default Home