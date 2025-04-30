import React, { useState, useEffect } from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config"
import { useSelector } from 'react-redux'
import { Query } from 'appwrite'
import SearchBox from '../components/SearchBox';

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [filteredPosts, setFilteredPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        if (userData) {
            loadPosts()
        }
    }, [userData])

    const loadPosts = async () => {
        try {
            setLoading(true)
            // Get user's own posts
            const userPosts = await appwriteService.getPosts(userData.id);

            // Get posts where user is a collaborator
            const collaboratedPosts = await appwriteService.getCollaboratedPosts(userData.email)

            // Combine and deduplicate posts
            const allPosts = [
                ...(userPosts?.documents || []),
                ...(collaboratedPosts?.documents || [])
            ]

            // Remove duplicates based on post ID
            const uniquePosts = allPosts.reduce((acc, post) => {
                if (!acc.find(p => p.$id === post.$id)) {
                    acc.push(post)
                }
                return acc
            }, [])

            setPosts(uniquePosts)
            setFilteredPosts(uniquePosts)
        } catch (error) {
            console.error("Error loading posts:", error)
        } finally {
            setLoading(false)
        }
    }

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
            <div className="w-full py-8">
                <Container>
                    <div className="flex flex-wrap justify-center">
                        <p>Loading posts...</p>
                    </div>
                </Container>
            </div>
        )
    }

    if (filteredPosts.length === 0) {
        return (
            <div className='w-full py-8'>
                <Container>
                    <div className="flex flex-col items-center mb-8">
                        <h1 className='text-2xl font-bold text-gray-800 mb-4'>My Posts</h1>
                        <SearchBox onSearch={handleSearch} placeholder="Search my posts by title..." />
                    </div>
                    <div className="text-center py-10">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {posts.length === 0 ? "You haven't created any posts yet" : "No posts found"}
                        </h2>
                        <p className="text-gray-600">
                            {posts.length === 0 
                                ? "Start sharing your thoughts by creating your first post!" 
                                : "Try different search terms to find your posts."}
                        </p>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className="flex flex-col items-center mb-8">
                    <h1 className='text-2xl font-bold text-gray-800 mb-4'>My Posts</h1>
                    <SearchBox onSearch={handleSearch} placeholder="Search my posts by title..." />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {filteredPosts.map((post) => (
                        <div key={post.$id}>
                            <PostCard 
                                {...post} 
                                isCollaborator={post.isCollaborator}
                                
                            />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts