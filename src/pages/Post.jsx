import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container, Modal } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import Notes from "../components/Notes";
import Like from "../components/Like";
import Comments from "../components/Comments";
import authService from "../appwrite/auth";

function Post() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [isCollaborator, setIsCollaborator] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        loadPost();
    }, [slug]);

    const loadPost = async () => {
        try {
            setLoading(true);
            const post = await appwriteService.getPost(slug);
            if (!post) {
                setError("Post not found");
                return;
            }

            // Check collaboration access only if user is logged in
            if (userData) {
                const isOwner = post.userId === userData.$id;
                if (!isOwner) {
                    const hasAccess = await appwriteService.checkCollaborationAccess(post.$id, userData.email);
                    setIsCollaborator(hasAccess);
                }
            }

            setPost(post);
        } catch (error) {
            setError("Error loading post");
            console.error("Error loading post:", error);
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async () => {
        try {
            const status = await appwriteService.deletePost(post.$id);
            if (status) {
                navigate("/");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    if (loading) {
        return (
            <div className="w-full py-8">
                <Container>
                    <div className="flex justify-center">
                        <p className="text-gray-600">Loading post...</p>
                    </div>
                </Container>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="w-full py-8">
                <Container>
                    <div className="flex justify-center">
                        <p className="text-red-600">{error || "Post not found"}</p>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <Container>
                <div className="max-w-4xl mx-auto">
                    <div className="w-full flex justify-center mb-4 relative">
                        <div className="max-h-[400px] w-full overflow-hidden rounded-xl">
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                            {userData && (post.userId === userData.$id || isCollaborator) && (
                                <div className="absolute right-6 top-6">
                                    <Link to={`/edit-post/${post.$id}`}>
                                        <Button bgColor="bg-green-500" className="mr-3">
                                            Edit
                                        </Button>
                                    </Link>
                                    {post.userId === userData.$id && (
                                        <Button 
                                            bgColor="bg-red-500" 
                                            onClick={() => setShowDeleteModal(true)}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-full mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
                       
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-yellow-900 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                    {post.userName?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-row space-x-2">
                                    <h3 className="text-gray-600 font-bold ">{post.userName}</h3>
                                    <p className="text-gray-500 text-sm pt-1">
                                        {new Date(post.$createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            {isCollaborator && (
                                <span className="px-3 py-1 text-sm text-yellow-800 bg-yellow-100 rounded-full">
                                    Collaborator
                                </span>
                            )}
                            <div className="mt-6">
                                <Like postId={post.$id} />
                            </div>
                        </div>
                        <div className="prose prose-lg max-w-none text-left mb-8">
                            {parse(post.content)}
                        </div>
                        {userData && <Notes postId={post.$id} />}
                        
                        <div className="mt-8">
                            <Comments postId={post.$id} />
                        </div>
                    </div>
                </div>
            </Container>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Confirm Delete"
            >
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Are you sure you want to delete this post?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        This action cannot be undone. The post will be permanently deleted.
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                deletePost();
                                setShowDeleteModal(false);
                            }}
                            className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        >
                            Delete Post
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Post;
