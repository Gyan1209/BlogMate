const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteNotesCollectionId: String(import.meta.env.VITE_APPWRITE_NOTES_COLLECTION_ID),
    appwriteLikesCollectionId: String(import.meta.env.VITE_APPWRITE_LIKES_COLLECTION_ID),
    appwriteCommentsCollectionId: String(import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    appwriteCollaborationId: String(import.meta.env.VITE_APPWRITE_INVITATIONS_COLLECTION_ID),
    viteopenapikey:String(import.meta.env.VITE_OPENAI_API_KEY),
    geminiApiKey: String(import.meta.env.VITE_GEMINI_API_KEY),
}

export default conf