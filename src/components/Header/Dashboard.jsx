import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'

function Dashboard() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
            navigate('/login')
        })
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-block px-4 duration-200 text-white hover:underline underline-offset-4"
            >
                Dashboard
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <ul>
                        <li className='px-2 py-1 hover:bg-gray-200'>
                            <Link to="/profile">Profile</Link>
                        </li>
                        <li className='px-2 py-1 hover:bg-gray-200'>
                            <Link to="/invitations">Invitations</Link>
                        </li>
                        <li className='px-2 py-1 hover:bg-gray-200'>
                            <Link to="/my-notes">My Notes</Link>
                        </li>
                        <li className='px-2 py-1 hover:bg-gray-200'>
                            <button
                                onClick={logoutHandler}
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Dashboard
