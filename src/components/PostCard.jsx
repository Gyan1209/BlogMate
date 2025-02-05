import React, { useState } from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'
import Modal from './Modal'

function PostCard({$id, title, featuredImage, content, summary, $createdAt, userId, isCollaborator, userName, status = "active"}) {
    const [showSummary, setShowSummary] = useState(false);

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
    
    const contentPreview = content ? `${getPlainText(content).slice(0, 150)}...` : '';
    
    return (
        <>
    
            <div className=" w-full max-w-md md:max-w-lg lg:max-w-3xl mx-autom-2  mb-1 hover:scale-105 duration-300">
                <div className="relative flex flex-col md:flex-row rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                    {status === "inactive" && (
                        <div className="absolute top-2 right-2 z-10 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            Inactive
                        </div>
                    )}
                    
                
                    <div className=" flex flex-grow p-4 md:p-6  flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center text-sm text-gray-600">
                                    <div className="w-8 h-8 bg-yellow-900 rounded-full flex items-center justify-center text-white font-medium mr-2">
                                        {userName?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-gray-600 font-bold">{userName}</span>
                                    <span className="mx-2 text-grey-400">•</span>
                                    <span className="text-gray-600">{formatDate($createdAt)}</span>
                                </div>
                                
                            </div>

                            <Link to={`/post/${$id}`} className='text-left'>
                                <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2">
                                    {title}
                                </h2>
                                
                                <p className="text-gray-600 line-clamp-3 mb-4">
                                    {contentPreview}
                                </p>

                                <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                                    Read more
                                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                            
                            {isCollaborator && (
                                <span className="ml-2 px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                                    Collaborator
                                </span>
                            )}
                        </div>
                    </div>
                    <div className=" flex flex-col m-2  md:w-1/3 h-48 md:h-45 flex-shrink-0  relative">
                    <div>
                        {summary && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowSummary(true);
                                    }}
                                className="px-3 m-1 z-50 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors duration-200"
                                    >
                            View Summary
                            </button>
                        )}
                        </div>

                        <div >
                        <img 
                            src={appwriteService.getFilePreview(featuredImage)} 
                            alt={title}
                            className=" my-8 absolute inset-0 rounded-lg w-full h-full object-cover transform group-hover:scale-100 transition-transform duration-300"
                        />
                        </div>
                        
                        
                        
                    </div>
                </div>
            </div>

            <Modal
                isOpen={showSummary}
                onClose={() => setShowSummary(false)}
                title="Post Summary"
            >
                <div className="prose prose-sm">
                    <h2 className="text-xl font-bold mb-4">{title}</h2>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-gray-700 leading-relaxed">{summary}</p>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default PostCard