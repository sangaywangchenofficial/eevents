import { useState } from 'react'
import PublicLayout from '../publiclayout/PublicLayout'
import { useNavigate } from 'react-router-dom'

const RegisterPage = () => {
    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        confirm_password: '',
    })

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setUser((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    // FIXED: Added missing handleSubmit function
    const handleSubmit = (e) => {
        e.preventDefault()

        // Basic validation example
        if (user.password !== user.confirm_password) {
            alert("Passwords do not match!")
            return
        }

        console.log('User registered details:', user)

    }

    return (
        <>
            <PublicLayout>
                <div>
                    <div className='flex flex-col justify-center items-center mt-10'>
                        <h1 className='text-3xl font-bold mb-4 text-center'>User Registration</h1>

                        <form onSubmit={handleSubmit} className='space-y-4 w-96 mt-10'>

                            <div className='flex flex-col'>
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    placeholder='First Name'
                                    value={user.first_name}
                                    onChange={handleChange}
                                    className='p-2 border border-gray-300 rounded-lg'
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    placeholder='Last Name'
                                    value={user.last_name}
                                    onChange={handleChange}
                                    className='p-2 border border-gray-300 rounded-lg'
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder='Email'
                                    value={user.email}
                                    onChange={handleChange}
                                    className='p-2 border border-gray-300 rounded-lg'
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    name="phone_number"
                                    placeholder='Phone Number'
                                    value={user.phone_number}
                                    onChange={handleChange}
                                    className='p-2 border border-gray-300 rounded-lg'
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder='Password'
                                    value={user.password}
                                    onChange={handleChange}
                                    className='p-2 border border-gray-300 rounded-lg'
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirm_password"
                                    placeholder='Confirm Password'
                                    value={user.confirm_password}
                                    onChange={handleChange}
                                    className='p-2 border border-gray-300 rounded-lg'
                                />
                            </div>

                            <button
                                type='submit'
                                className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium p-2 rounded-lg mt-4 transition-colors'
                            >
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </PublicLayout>
        </>
    )
}

export default RegisterPage
