import conf from "../conf/conf";
import { Client, Databases, Query } from "appwrite";

export class NotesService {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    async createNote(postId, content, userId) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteNotesCollectionId,
                'unique()',
                {
                    postId,
                    content,
                    userId,
                }
            );
        } catch (error) {
            console.log("Appwrite service :: createNote :: error", error);
            return false;
        }
    }

    async getNotesByUser(userId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteNotesCollectionId,
                [Query.equal("userId", userId)]
            );
            return response.documents;
        } catch (error) {
            console.log("Appwrite service :: getNotesByUser :: error", error);
            return [];
        }
    }

    async getNoteByPostId(postId, userId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteNotesCollectionId,
                [
                    Query.equal("postId", postId),
                    Query.equal("userId", userId)
                ]
            );
            return response.documents[0];
        } catch (error) {
            console.log("Appwrite service :: getNoteByPostId :: error", error);
            return null;
        }
    }

    async updateNote(noteId, content) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteNotesCollectionId,
                noteId,
                {
                    content
                }
            );
        } catch (error) {
            console.log("Appwrite service :: updateNote :: error", error);
            return false;
        }
    }

    async deleteNote(noteId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteNotesCollectionId,
                noteId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteNote :: error", error);
            return false;
        }
    }
}

const notesService = new NotesService();
export default notesService;
