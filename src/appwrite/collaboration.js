import conf from '../conf/conf.js';
import { Client, ID, Databases, Query } from "appwrite";

export class CollaborationService {
    client = new Client();
    databases;
    
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    // Send collaboration invitation
    async sendInvitation(postId, inviterId, inviteeEmail) {
        try {
            console.log('Sending invitation:', { postId, inviterId, inviteeEmail });
            console.log('Using collection:', conf.appwriteCollaborationId);
            
            const response = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollaborationId,
                ID.unique(),
                {
                    postId,
                    inviterId,
                    inviteeEmail,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                }
            );
            console.log('Invitation sent successfully:', response);
            return response;
        } catch (error) {
            console.error("CollaborationService :: sendInvitation :: error", error);
            console.error("Error details:", {
                databaseId: conf.appwriteDatabaseId,
                collectionId: conf.appwriteCollaborationId,
                postId,
                inviterId,
                inviteeEmail
            });
            throw error;
        }
    }

    // Get all invitations for a user
    async getInvitations(email) {
        try {
            console.log('Fetching invitations for email:', email);
            console.log('Using collection:', conf.appwriteCollaborationId);
            
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollaborationId,
                [
                    Query.equal('inviteeEmail', email)
                ]
            );
            console.log('Fetched invitations:', response);
            return response;
        } catch (error) {
            console.error("CollaborationService :: getInvitations :: error", error);
            console.error("Error details:", {
                databaseId: conf.appwriteDatabaseId,
                collectionId: conf.appwriteCollaborationId,
                email
            });
            throw error;
        }
    }

    // Accept or reject invitation
    async updateInvitationStatus(invitationId, status) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollaborationId,
                invitationId,
                {
                    status
                }
            )
        } catch (error) {
            console.error("CollaborationService :: updateInvitationStatus :: error", error);
            throw error;
        }
    }

    // Get collaborators for a post
    async getCollaborators(postId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollaborationId,
                [
                    Query.equal('postId', postId),
                    Query.equal('status', 'accepted')
                ]
            )
        } catch (error) {
            console.error("CollaborationService :: getCollaborators :: error", error);
            throw error;
        }
    }
}

const collaborationService = new CollaborationService();
export default collaborationService;
