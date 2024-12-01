import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import collaborationService from '../appwrite/collaboration'

function PostCollaboration({ postId, onError }) {
    const userData = useSelector((state) => state.auth.userData)
    const [inviteeEmail, setInviteeEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [collaborators, setCollaborators] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        loadCollaborators()
    }, [postId])

    const loadCollaborators = async () => {
        try {
            const response = await collaborationService.getCollaborators(postId)
            if (response?.documents) {
                setCollaborators(response.documents)
            }
        } catch (error) {
            console.error('Error loading collaborators:', error)
            onError && onError(error.message)
        }
    }

    const handleInvite = async () => {
        if (loading) return
        
        setError('')
        setLoading(true)

        try {
            if (!inviteeEmail) {
                throw new Error('Please enter an email address')
            }

            if (inviteeEmail === userData.email) {
                throw new Error('You cannot invite yourself')
            }

            await collaborationService.sendInvitation(
                postId,
                userData.$id,
                inviteeEmail
            )

            setInviteeEmail('')
            loadCollaborators() // Refresh collaborator list
        } catch (error) {
            setError(error.message)
            onError && onError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaborators</h3>
            
            {/* Invite Section */}
            <div className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="email"
                        value={inviteeEmail}
                        onChange={(e) => setInviteeEmail(e.target.value)}
                        placeholder="Enter collaborator's email"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                handleInvite()
                            }
                        }}
                    />
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            handleInvite()
                        }}
                        disabled={loading}
                        className="px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-50"
                        type="button"
                    >
                        {loading ? 'Inviting...' : 'Invite'}
                    </button>
                </div>
                {error && (
                    <p className="mt-2 text-sm text-red-600">
                        {error}
                    </p>
                )}
            </div>

            {/* Collaborators List */}
            <div className="space-y-2">
                {collaborators.map((collab) => (
                    <div
                        key={collab.$id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                {collab.inviteeEmail}
                            </p>
                            <p className="text-xs text-gray-500">
                                Joined {new Date(collab.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                            Active
                        </span>
                    </div>
                ))}
                {collaborators.length === 0 && (
                    <p className="text-sm text-gray-500">
                        No collaborators yet
                    </p>
                )}
            </div>
        </div>
    )
}

export default PostCollaboration
