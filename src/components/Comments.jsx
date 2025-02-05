import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import interactionsService from '../appwrite/interactions'

function Comments({ postId }) {
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [editingComment, setEditingComment] = useState(null)
    const [editContent, setEditContent] = useState('')
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        if (postId) {
            loadComments()
        }
    }, [postId])

    const loadComments = async () => {
        const fetchedComments = await interactionsService.getComments(postId)
        setComments(fetchedComments)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newComment.trim() || !userData) return

        const comment = await interactionsService.addComment(
            postId,
            userData.$id,
            newComment,
            userData.name
        )

        if (comment) {
            setComments([comment, ...comments])
            setNewComment('')
        }
    }

    const handleEdit = async (e) => {
        e.preventDefault()
        if (!editContent.trim()) return

        const updated = await interactionsService.updateComment(
            editingComment.$id,
            editContent
        )

        if (updated) {
            setComments(comments.map(comment => 
                comment.$id === editingComment.$id 
                    ? { ...comment, content: editContent }
                    : comment
            ))
            setEditingComment(null)
            setEditContent('')
        }
    }

    const startEdit = (comment) => {
        setEditingComment(comment)
        setEditContent(comment.content)
    }

    const handleDelete = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            const success = await interactionsService.deleteComment(commentId)
            if (success) {
                setComments(comments.filter(comment => comment.$id !== commentId))
            }
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (!userData) {
        return (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-center text-gray-600">Please log in to comment</p>
            </div>
        )
    }

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Comments</h3>
            
            {/* Add Comment Form */}
            <form onSubmit={handleSubmit} className="mb-8">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                />
                <button
                    type="submit"
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={!newComment.trim()}
                >
                    Post Comment
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.$id} className="bg-white p-4 rounded-lg shadow">
                        {editingComment?.$id === comment.$id ? (
                            <form onSubmit={handleEdit} className="space-y-3">
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                />
                                <div className="flex space-x-3">
                                    <button
                                        type="submit"
                                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingComment(null)}
                                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-semibold text-blue-600">{comment.userName}</h4>
                                        <p className="text-sm text-gray-500">{formatDate(comment.$createdAt)}</p>
                                    </div>
                                    {userData.$id === comment.userId && (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => startEdit(comment)}
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(comment.$id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                            </>
                        )}
                    </div>
                ))}
                
                {comments.length === 0 && (
                    <p className="text-center text-gray-600">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    )
}

export default Comments
