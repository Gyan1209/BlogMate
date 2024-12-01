import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select, Container } from "..";
import PostCollaboration from '../PostCollaboration'
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [error, setError] = useState(null);

    const submit = async (data) => {
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if (file) {
                appwriteService.deleteFile(post.featuredImage);
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            const file = await appwriteService.uploadFile(data.image[0]);

            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;
                const dbPost = await appwriteService.createPost({ ...data,userName: userData.name, userId: userData.$id });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <Container>
                
                    <div className="bg-gradient-to-r from-purple-400 to-purple-800 px-8 py-6">
                        <h2 className="text-3xl font-bold text-white">
                            {post ? "Edit Your Story" : "Share Your Story"}
                        </h2>
                        <p className="mt-2 text-purple-100">
                            {post ? "Make it even better" : "Create something amazing"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(submit)} className="p-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="flex-grow space-y-6">
                                <div className="bg-purple-50 rounded-xl p-6">
                                    <Input
                                        label="Title"
                                        placeholder="Enter an engaging title"
                                        className="mb-4"
                                        {...register("title", { required: true })}
                                    />
                                    <Input
                                        label="URL Slug"
                                        placeholder="your-post-url"
                                        className="mb-4"
                                        {...register("slug", { required: true })}
                                        onInput={(e) => {
                                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                                        }}
                                    />
                                </div>

                                <div className="bg-white rounded-xl shadow-sm">
                                    <RTE 
                                        label="Content" 
                                        name="content" 
                                        control={control} 
                                        defaultValue={getValues("content")} 
                                    />
                                </div>
                            </div>

                            <div className="lg:w-80 space-y-6">
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Settings</h3>
                                    <div className="space-y-4">
                                        <Select
                                            options={["active", "inactive"]}
                                            label="Status"
                                            {...register("status", { required: true })}
                                        />
                                        <div>
                                            <Input
                                                label="Featured Image"
                                                type="file"
                                                accept="image/png, image/jpg, image/jpeg, image/gif"
                                                {...register("image", { required: !post })}
                                            />
                                            {post && (
                                                <div className="mt-4">
                                                    <img
                                                        src={appwriteService.getFilePreview(post.featuredImage)}
                                                        alt={post.title}
                                                        className="rounded-lg w-full h-48 object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {post && (
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <PostCollaboration 
                                            postId={post.$id} 
                                            onError={(msg) => setError(msg)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-600 text-center">{error}</p>
                            </div>
                        )}

                        <div className="mt-8 flex justify-end">
                            <Button 
                                type="submit" 
                                bgColor={post ? "bg-green-500" : "bg-purple-600"}
                                className="px-8 py-2 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                {post ? "Update Story" : "Publish Story"}
                            </Button>
                        </div>
                    </form>
                
            </Container>
        </div>
    );
}
