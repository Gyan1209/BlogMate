import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
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
    const [username, setUsername] = useState("");
    
    useEffect(() => {
        if (slug && userData) {
            loadPost();
        }
    }, [slug, userData]);

    const loadPost = async () => {
        try {
            setLoading(true);
            const post = await appwriteService.getPost(slug);
            if (!post) {
                setError("Post not found");
                return;
            }

            // Check if user is owner or collaborator
            const isOwner = post.userId === userData.$id;
            if (!isOwner) {
                const hasAccess = await appwriteService.checkCollaborationAccess(post.$id, userData.email);
                setIsCollaborator(hasAccess);
            }

            setPost(post);
            ;
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
        <div className="py-8">
            <Container>
                <div className="max-w-4xl mx-auto">
                    <div className="w-full flex justify-center mb-4 relative">
                        <div className="max-h-[400px] w-full overflow-hidden rounded-xl">
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {(post.userId === userData.$id || isCollaborator) && (
                            <div className="absolute right-6 top-6">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button bgColor="bg-green-500" className="mr-3">
                                        Edit
                                    </Button>
                                </Link>
                                {post.userId === userData.$id && (
                                    <Button bgColor="bg-red-500" onClick={deletePost}>
                                        Delete
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="w-full mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-black text-xl font-bold">
                                    {post.userName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{post.userName}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(post.$createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <Like postId={post.$id} />
                        </div>
                    </div>
                    {isCollaborator && (
                        <div className="mb-4 p-2 bg-yellow-100 rounded-lg">
                            <p className="text-yellow-800 text-sm">
                                You are a collaborator on this post
                            </p>
                        </div>
                    )}
                    <div className="prose prose-lg max-w-none mb-8">
                        {parse(post.content)}
                    </div>
                    {userData && <Notes postId={post.$id} />}
                    <Comments postId={post.$id} />
                </div>
            </Container>
        </div>
    );
}

export default Post;
