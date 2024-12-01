import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import interactionsService from '../appwrite/interactions'

function Like({ postId }) {
    const [likes, setLikes] = useState([])
    const [userLike, setUserLike] = useState(null)
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        if (postId) {
            loadLikes()
        }
    }, [postId])

    useEffect(() => {
        if (userData && postId) {
            checkUserLike()
        }
    }, [userData, postId])

    const loadLikes = async () => {
        const fetchedLikes = await interactionsService.getLikes(postId)
        setLikes(fetchedLikes)
    }

    const checkUserLike = async () => {
        const like = await interactionsService.getUserLike(postId, userData.$id)
        setUserLike(like)
    }

    const handleLike = async () => {
        if (!userData) return

        if (userLike) {
            const success = await interactionsService.removeLike(userLike.$id)
            if (success) {
                setLikes(likes.filter(like => like.$id !== userLike.$id))
                setUserLike(null)
            }
        } else {
            const like = await interactionsService.addLike(postId, userData.$id)
            if (like) {
                setLikes([...likes, like])
                setUserLike(like)
            }
        }
    }

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={handleLike}
                disabled={!userData}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                    userLike 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill={userLike ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={userLike ? "0" : "2"}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
                <span>{likes.length}</span>
            </button>
            {!userData && (
                <span className="text-sm text-gray-500">Login to like posts</span>
            )}
        </div>
    )
}

export default Like
