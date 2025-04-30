import React, { useState } from 'react'
import { X } from 'lucide-react' // assuming you're using lucide-react, feel free to use any icon lib

function SearchBox({ onSearch, placeholder = "Search posts..." }) {
    const [searchTerm, setSearchTerm] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        onSearch(searchTerm)
    }

    const clearSearch = () => {
        setSearchTerm("")
        onSearch("") // Reset the filter
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mb-8">
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 pr-10 text-gray-700 bg-white border rounded-lg focus:outline-none focus:border-blue-500"
                />

               
                {searchTerm && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-red-500 mx-4"
                    >
                        <X size={18} />
                    </button>
                )}

      
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Search
                </button>
            </div>
        </form>
    )
}

export default SearchBox
