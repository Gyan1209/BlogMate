import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'

function PostCard({$id, title, featuredImage, content, $createdAt, userId, isCollaborator, userName, status = "active"}) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getPlainText = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };
    
    const contentPreview = content ? `${getPlainText(content).slice(0, 100)}...` : '';
    
    return (
        <Link to={`/post/${$id}`}>
            <div className="relative flex bg-blue-50 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {status === "inactive" && (
                    <div className="absolute top-2 right-2 z-10 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Inactive
                    </div>
                )}
                
                {/* Content Section - Left Side */}
                <div className="flex-grow p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-medium mr-2">
                                {userName?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-purple-700">{userName}</span>
                            <span className="mx-2 text-purple-300">•</span>
                            <span className="text-gray-600">{formatDate($createdAt)}</span>
                            {isCollaborator && (
                                <span className="ml-2 px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                                    Collaborator
                                </span>
                            )}
                        </div>

                        <h2 className="text-xl text-left font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-200">
                            {title}
                        </h2>
                        
                        <p className="text-gray-600 text-left line-clamp-2 mb-4">
                            {contentPreview}
                        </p>
                    </div>

                    <div className="flex items-center text-purple-600 font-medium group-hover:text-purple-700">
                        Read more
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>

                {/* Image Section - Right Side */}
                <div className="w-1/3 m-5 rounded-lg relative overflow-hidden">
                    <img 
                        src={appwriteService.getFilePreview(featuredImage)} 
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/10 group-hover:opacity-0 transition-opacity duration-300"></div>
                </div>
            </div>
        </Link>
    )
}

export default PostCard