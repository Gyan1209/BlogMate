import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Container } from '../components'
import { Link } from 'react-router-dom'
import authService from '../appwrite/auth'
import { login } from '../store/authSlice'
import { useForm } from 'react-hook-form'

function Profile() {
    const userData = useSelector((state) => state.auth.userData)
    const dispatch = useDispatch()
    const [isEditing, setIsEditing] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [error, setError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [loading, setLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)
    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            name: userData?.name || "",
            email: userData?.email || "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    })

    const updateProfile = async (data) => {
        setError("")
        setLoading(true)
        try {
            const updatedUser = await authService.account.updateName(data.name)
            if (updatedUser) {
                dispatch(login({ userData: updatedUser }))
                setIsEditing(false)
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const updatePassword = async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            setPasswordError("New passwords do not match")
            return
        }
        
        setPasswordError("")
        setPasswordLoading(true)
        try {
            await authService.account.updatePassword(data.newPassword, data.oldPassword)
            setIsChangingPassword(false)
            // Reset password fields
            setValue("oldPassword", "")
            setValue("newPassword", "")
            setValue("confirmPassword", "")
        } catch (error) {
            setPasswordError(error.message)
        } finally {
            setPasswordLoading(false)
        }
    }

    if (!userData) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            Please login to view your profile
                        </h1>
                        <Link
                            to="/login"
                            className="px-6 py-2 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-colors duration-200"
                        >
                            Login
                        </Link>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="w-full py-8">
            <Container>
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                            <div className="space-x-2">
                                <button
                                    onClick={() => {
                                        if (isEditing) {
                                            setValue("name", userData.name)
                                            setValue("email", userData.email)
                                        }
                                        setIsEditing(!isEditing)
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                >
                                    {isEditing ? "Cancel" : "Edit Profile"}
                                </button>
                                <button
                                    onClick={() => {
                                        if (isChangingPassword) {
                                            setValue("oldPassword", "")
                                            setValue("newPassword", "")
                                            setValue("confirmPassword", "")
                                        }
                                        setIsChangingPassword(!isChangingPassword)
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                >
                                    {isChangingPassword ? "Cancel" : "Change Password"}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-4xl font-bold text-black">
                                {userData.name.charAt(0).toUpperCase()}
                            </div>
                            {!isEditing ? (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {userData.name}
                                    </h2>
                                    <p className="text-gray-600">
                                        {userData.email}
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit(updateProfile)} className="flex-1">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                                {...register("name", {
                                                    required: "Name is required",
                                                })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                disabled
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                                                {...register("email")}
                                            />
                                            <p className="mt-1 text-sm text-gray-500">
                                                Email cannot be changed
                                            </p>
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-4 py-2 bg-yellow-400 text-Black rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-50"
                                            >
                                                {loading ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>

                        {isChangingPassword && (
                            <div className="mt-8 border-t pt-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
                                {passwordError && (
                                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                                        {passwordError}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit(updatePassword)} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                            {...register("oldPassword", {
                                                required: "Current password is required",
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                            {...register("newPassword", {
                                                required: "New password is required",
                                                minLength: {
                                                    value: 8,
                                                    message: "Password must be at least 8 characters"
                                                }
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                            {...register("confirmPassword", {
                                                required: "Please confirm your password",
                                                validate: (val) => {
                                                    if (watch('newPassword') != val) {
                                                        return "Passwords do not match";
                                                    }
                                                }
                                            })}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={passwordLoading}
                                            className="px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-50"
                                        >
                                            {passwordLoading ? "Updating..." : "Update Password"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                        
                        <div className="mt-8 border-t pt-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600">Account ID</p>
                                    <p className="text-gray-900">{userData.$id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email Status</p>
                                    <p className="text-gray-900">
                                        {userData.emailVerification ? (
                                            <span className="text-green-600">Verified</span>
                                        ) : (
                                            <span className="text-red-600">Not Verified</span>
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Account Created</p>
                                    <p className="text-gray-900">
                                        {new Date(userData.$createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Profile
