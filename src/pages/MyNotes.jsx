import React, { useState, useEffect } from 'react'
import { Container } from '../components'
import notesService from '../appwrite/notes'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import appwriteService from '../appwrite/config'

function MyNotes() {
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [posts, setPosts] = useState({})
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        if (userData) {
            loadNotes()
        }
    }, [userData])

    const loadNotes = async () => {
        try {
            const userNotes = await notesService.getNotesByUser(userData.$id)
            setNotes(userNotes)

            // Fetch post details for each note
            const postDetails = {}
            for (const note of userNotes) {
                const post = await appwriteService.getPost(note.postId)
                if (post) {
                    postDetails[note.postId] = post
                }
            }
            setPosts(postDetails)
            setLoading(false)
        } catch (error) {
            console.error('Error loading notes:', error)
            setLoading(false)
        }
    }

    const handleDeleteNote = async (noteId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            const success = await notesService.deleteNote(noteId)
            if (success) {
                setNotes(notes.filter(note => note.$id !== noteId))
            }
        }
    }

    if (loading) {
        return (
            <div className="w-full py-8">
                <Container>
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h1>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="w-full py-8">
            <Container>
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">My Notes</h1>
                    
                    {notes.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">You haven't made any notes yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {notes.map((note) => (
                                <div key={note.$id} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <Link 
                                                to={`/post/${posts[note.postId]?.$id}`}
                                                className="text-xl font-semibold text-purple-600 hover:text-purple-700"
                                            >
                                                {posts[note.postId]?.title || 'Deleted Post'}
                                            </Link>
                                            <p className="text-sm text-gray-500">
                                                {new Date(note.$createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteNote(note.$id)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default MyNotes
