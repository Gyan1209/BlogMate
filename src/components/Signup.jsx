import React, {useState} from 'react'
import authService from '../appwrite/auth'
import {Link ,useNavigate} from 'react-router-dom'
import {login} from '../store/authSlice'
import {Button, Input, Logo} from './index.js'
import {useDispatch} from 'react-redux'
import {useForm} from 'react-hook-form'
import {toast} from "react-hot-toast";

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const {register, handleSubmit,formState:{errors}} = useForm()

    const create = async(data) => {
        setError("")
        try {
            const response = await authService.createAccount(data);
            if(response.status!=201){
                toast.error(response.message);
            }
            else {
                dispatch(login(response.loginData));
                toast.success(response.message)
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
            <div className="mb-2 flex justify-center">
                    <span className="inline-block  w-full max-w-[100px]">
                        <Logo width="100%" className=" text-yellow-900"/>
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(create)}>
                    <div className='space-y-5'>
                        <div>
                            <Input
                            label="Full Name: "
                            placeholder="Enter your full name"
                            {...register("name", {
                                required: "Name is required",
                            })}
                            />
                            {errors.name &&(<p className="text-red-500 text-sm mt-1">{errors.name.message}</p>)}
                        </div>
                        
                        <div>
                            <Input
                            label="Email:"
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                validate: {
                                matchPattern: (value) =>
                                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                    "Email address must be a valid address",
                                },
                            })}
                            />
                            {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>
        
                        <div>
                            <Input
                            label="Password:"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters",
                                },
                                validate: {
                                hasNumber: (value) =>
                                    /\d/.test(value) || "Password must contain at least one number",
                                hasSpecialChar: (value) =>
                                    /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Password must contain at least one special character",
                                },
                            })}
                            />
                            {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>

    </div>
  )
}

export default Signup