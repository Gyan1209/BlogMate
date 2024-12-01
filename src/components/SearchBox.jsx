import React, { useState } from 'react'

function SearchBox({ onSearch, placeholder = "Search posts..." }) {
    const [searchTerm, setSearchTerm] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        onSearch(searchTerm)
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mb-8">
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:border-purple-500"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                    Search
                </button>
            </div>
        </form>
    )
}

export default SearchBox
