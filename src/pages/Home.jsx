import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container, PostCard} from '../components'
import { Query } from 'appwrite';
import SearchBox from '../components/SearchBox';

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filteredPosts, setFilteredPosts] = useState([])

    useEffect(() => {
        appwriteService.getPosts([Query.equal("status", "active")]).then((posts) => {
            if (posts) {
                setPosts(posts.documents)
                setFilteredPosts(posts.documents)
            }
            setLoading(false)
        })
    }, [])

    const handleSearch = (searchTerm) => {
        if (!searchTerm.trim()) {
            setFilteredPosts(posts)
            return
        }
        
        const searchTermLower = searchTerm.toLowerCase()
        const filtered = posts.filter(post => 
            post.title.toLowerCase().includes(searchTermLower)
        )
        setFilteredPosts(filtered)
    }
  
    if (loading) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex justify-center items-center min-h-[200px]">
                        <p className="text-gray-600">Loading posts...</p>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Latest Blog Posts</h1>
                    <SearchBox onSearch={handleSearch} placeholder="Search posts by title..." />
                </div>
                
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-10">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            No posts found
                        </h2>
                        <p className="text-gray-600">Try different search terms or check back later for new content!</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {filteredPosts.map((post) => (
                            <div key={post.$id}>
                                {console.log(post.$id)}
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