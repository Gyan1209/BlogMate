import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import notesService from '../appwrite/notes'

function Notes({ postId }) {
    const [note, setNote] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [savedNote, setSavedNote] = useState(null)
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        if (userData && postId) {
            loadNote()
        }
    }, [userData, postId])

    const loadNote = async () => {
        const existingNote = await notesService.getNoteByPostId(postId, userData.$id)
        if (existingNote) {
            setNote(existingNote.content)
            setSavedNote(existingNote)
        }
    }

    const handleSave = async () => {
        if (!note.trim()) return

        try {
            let result
            if (savedNote) {
                result = await notesService.updateNote(savedNote.$id, note)
            } else {
                result = await notesService.createNote(postId, note, userData.$id)
            }

            if (result) {
                setSavedNote(result)
                setIsEditing(false)
            }
        } catch (error) {
            console.error('Error saving note:', error)
        }
    }

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCancel = () => {
        setNote(savedNote ? savedNote.content : '')
        setIsEditing(false)
    }

    if (!userData) return null

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">My Notes</h3>
            
            {isEditing ? (
                <div className="space-y-4">
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full h-32 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Write your notes here..."
                    />
                    <div className="flex space-x-3">
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    {savedNote ? (
                        <div>
                            <p className="text-gray-700 whitespace-pre-wrap mb-4">{note}</p>
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Edit Notes
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleEdit}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Add Notes
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default Notes
