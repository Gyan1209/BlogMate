import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Container } from '../components'
import collaborationService from '../appwrite/collaboration'

function Invitations() {
    const userData = useSelector((state) => state.auth.userData)
    const [invitations, setInvitations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (userData) {
            loadInvitations()
        }
    }, [userData])

    const loadInvitations = async () => {
        try {
            const response = await collaborationService.getInvitations(userData.email)
            if (response?.documents) {
                setInvitations(response.documents)
            }
        } catch (error) {
            setError('Failed to load invitations')
            console.error('Error loading invitations:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleInvitation = async (invitationId, status) => {
        try {
            await collaborationService.updateInvitationStatus(invitationId, status)
            // Refresh invitations list
            loadInvitations()
        } catch (error) {
            setError('Failed to update invitation')
            console.error('Error updating invitation:', error)
        }
    }

    if (loading) {
        return (
            <Container>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-500">Loading invitations...</p>
                </div>
            </Container>
        )
    }

    return (
        <Container>
            <div className="py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Collaboration Invitations</h1>
                
                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {invitations.map((invitation) => (
                        <div
                            key={invitation.$id}
                            className="p-4 bg-white shadow rounded-lg border"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Post Collaboration Invitation
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        From: {invitation.inviterId}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Sent: {new Date(invitation.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {invitation.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleInvitation(invitation.$id, 'accepted')}
                                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleInvitation(invitation.$id, 'rejected')}
                                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {invitation.status !== 'pending' && (
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            invitation.status === 'accepted' 
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {invitations.length === 0 && (
                        <p className="text-center text-gray-500">
                            No invitations found
                        </p>
                    )}
                </div>
            </div>
        </Container>
    )
}

export default Invitations
