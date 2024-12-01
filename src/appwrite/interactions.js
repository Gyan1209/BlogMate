import conf from "../conf/conf";
import { Client, Databases, Query } from "appwrite";

export class InteractionsService {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    // Likes methods
    async addLike(postId, userId) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteLikesCollectionId,
                'unique()',
                {
                    postId,
                    userId,
                }
            );
        } catch (error) {
            console.log("Appwrite service :: addLike :: error", error);
            return false;
        }
    }

    async removeLike(likeId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteLikesCollectionId,
                likeId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: removeLike :: error", error);
            return false;
        }
    }

    async getLikes(postId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteLikesCollectionId,
                [Query.equal("postId", postId)]
            );
            return response.documents;
        } catch (error) {
            console.log("Appwrite service :: getLikes :: error", error);
            return [];
        }
    }

    async getUserLike(postId, userId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteLikesCollectionId,
                [
                    Query.equal("postId", postId),
                    Query.equal("userId", userId)
                ]
            );
            return response.documents[0];
        } catch (error) {
            console.log("Appwrite service :: getUserLike :: error", error);
            return null;
        }
    }

    // Comments methods
    async addComment(postId, userId, content, userName) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCommentsCollectionId,
                'unique()',
                {
                    postId,
                    userId,
                    content,
                    userName
                }
            );
        } catch (error) {
            console.log("Appwrite service :: addComment :: error", error);
            return false;
        }
    }

    async updateComment(commentId, content) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCommentsCollectionId,
                commentId,
                {
                    content
                }
            );
        } catch (error) {
            console.log("Appwrite service :: updateComment :: error", error);
            return false;
        }
    }

    async deleteComment(commentId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCommentsCollectionId,
                commentId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteComment :: error", error);
            return false;
        }
    }

    async getComments(postId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCommentsCollectionId,
                [
                    Query.equal("postId", postId),
                    Query.orderDesc("$createdAt")
                ]
            );
            return response.documents;
        } catch (error) {
            console.log("Appwrite service :: getComments :: error", error);
            return [];
        }
    }
}

const interactionsService = new InteractionsService();
export default interactionsService;
