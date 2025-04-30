import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

const{backendUrl}=conf;

export class Service{
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, content, featuredImage, status, summary}){
        try{
            const token=localStorage.getItem("token");
            const response=await fetch(`${backendUrl}/api/post/create`,{
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                    "token":token,
                },
                body: JSON.stringify({title, content, featuredImage, status, summary}),
            });
            const data = await response.json();
            // console.log("respose after post creation:" ,data.post);
            if(response.status!=201) return false;
            return data.post;
        }catch(error){
            console.log(`internal error while creating: ${error}`);
            return false;
        }
    }


    async updatePost(slug, {title, content, featuredImage, status, summary}){
        try {
            const token=localStorage.getItem("token");
            const response = await fetch(`${backendUrl}/api/post/update/${slug}`,{
                method:'PUT',
                headers:{
                    "Content-Type": "application/json",
                    "token":token,
                },
                body:JSON.stringify({title,content, featuredImage,status,summary}),
            })
            if(!response.ok) return false;
            const data=await response.json(); 
            return data.post ;
            
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
        }
    }


    async getPost(slug){
        try {
            const post=await fetch(`${backendUrl}/api/post/get-post/${slug}`);
            if(!post) return false;
            const postData=await post.json();
            return postData.post;
        } catch (error) {
            console.log("error while fetching a post:", error);
            return false;
        }
    }

    async getAllPosts(status="active"){
        try{
            const response=await fetch(`${backendUrl}/api/post/get-all-post/${status}`);
            const data=await response.json();
            if(!data) return false;
            return data.allPosts;
        }catch(err){
            console.log(`error while fetching all post:  ${err}`);
            return false;
        }
    }


    async deletePost(slug,userId){
        try {
            const response=await fetch(`${backendUrl}/api/post/delete-post/${slug}`,{
                method:'DELETE',
                headers: {
                "Content-Type": "application/json",
                },
                body:JSON.stringify({userId})
            })
            if(!response.ok) return false;
            return response;
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }


    async tinyMCEuploadImageHandler(blobInfo, progress) {
        return new Promise(async (resolve, reject) => {
          const formData = new FormData();
          formData.append("image", blobInfo.blob(), blobInfo.filename());
            console.log(blobInfo.blob()," and ",blobInfo.filename())
          try {
            const response = await fetch(`${backendUrl}/api/post/image-upload`, {
              method: "POST",
              headers: {
                token: `${localStorage.getItem("token")}`,
              },
              body: formData,
            });
      
            const data = await response.json();
      
            if (!data.imageUrl) {
              return reject("Image URL not found in response");
            }
      
            resolve(data.imageUrl);
          } catch (error) {
            console.error("Upload failed", error);
            reject("Image upload failed.");
          }
        });
    };

    async uploadFile(image){
        const formData=new FormData();
        formData.append("image",image);
        try{
            if(!image) return false;
            const response=await fetch(`${backendUrl}/api/post/image-upload`,{
                method:"POST",
                headers: {
                    token: `${localStorage.getItem("token")}`,
                },
                body: formData,
            })
            const data=await response.json();
            if(!data.imageUrl) return false;
            return data.imageUrl;
        }catch(error){
            return false;
        }
    }

    getFilePreview(url){
        
        if (!url) return '';
        const img= url.replace('/upload/', '/upload/w_200,h_200,c_fill/');
       
        return img;
        
    };
      


    















    

    

    

    async checkCollaborationAccess(postId, userEmail) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollaborationId,
                [
                    Query.equal('postId', postId),
                    Query.equal('inviteeEmail', userEmail),
                    Query.equal('status', 'accepted')
                ]
            );
            return response.documents.length > 0;
        } catch (error) {
            console.log("Appwrite service :: checkCollaborationAccess :: error", error);
            return false;
        }
    }

    async getPosts(queries = []) {
        try {
            const posts = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );
            
            return posts;
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            return false;
        }
    }

    async getCollaboratedPosts(userEmail) {
        try {
            // First get all collaborations for this user
            const collaborations = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollaborationId,
                [
                    Query.equal('inviteeEmail', userEmail),
                    Query.equal('status', 'accepted')
                ]
            );

            // Get all posts that user is collaborating on
            const postIds = collaborations.documents.map(collab => collab.postId);
            if (postIds.length === 0) return { documents: [] };

            const posts = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    Query.equal('$id', postIds)
                ]
            );

            // Add isCollaborator flag to each post
            posts.documents = posts.documents.map(post => ({
                ...post,
                isCollaborator: true
            }));

            return posts;
        } catch (error) {
            console.log("Appwrite service :: getCollaboratedPosts :: error", error);
            return false;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
                

            )
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }

    // file upload service


      

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }


    

   
}


const service = new Service()
export default service






// import conf from '../conf/conf.js';
// import { Client, ID, Databases, Storage, Query } from "appwrite";

// export class Service{
//     client = new Client();
//     databases;
//     bucket;
    
//     constructor(){
//         this.client
//         .setEndpoint(conf.appwriteUrl)
//         .setProject(conf.appwriteProjectId);
//         this.databases = new Databases(this.client);
//         this.bucket = new Storage(this.client);
//     }

//     async createPost({title, slug, content, featuredImage, status, userId, userName, summary}){
//         try {
//             return await this.databases.createDocument(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 slug,
//                 {
//                     title,
//                     content,
//                     featuredImage,
//                     status,
//                     userId,
//                     userName,
//                     summary
//                 }
//             )
//         } catch (error) {
//             console.log("Appwrite serive :: createPost :: error", error);
//         }
//     }

//     async updatePost(slug, {title, content, featuredImage, status, summary}){
//         try {
//             return await this.databases.updateDocument(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 slug,
//                 {
//                     title,
//                     content,
//                     featuredImage,
//                     status,
//                     summary
//                 }
//             )
//         } catch (error) {
//             console.log("Appwrite serive :: updatePost :: error", error);
//         }
//     }

//     async deletePost(slug){
//         try {
//             await this.databases.deleteDocument(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 slug
            
//             )
//             return true
//         } catch (error) {
//             console.log("Appwrite serive :: deletePost :: error", error);
//             return false
//         }
//     }

//     async getPost(slug){
//         try {
//             return await this.databases.getDocument(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 slug
            
//             )
//         } catch (error) {
//             console.log("Appwrite serive :: getPost :: error", error);
//             return false
//         }
//     }

//     async checkCollaborationAccess(postId, userEmail) {
//         try {
//             const response = await this.databases.listDocuments(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollaborationId,
//                 [
//                     Query.equal('postId', postId),
//                     Query.equal('inviteeEmail', userEmail),
//                     Query.equal('status', 'accepted')
//                 ]
//             );
//             return response.documents.length > 0;
//         } catch (error) {
//             console.log("Appwrite service :: checkCollaborationAccess :: error", error);
//             return false;
//         }
//     }

//     async getPosts(queries = []) {
//         try {
//             const posts = await this.databases.listDocuments(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 queries
//             );
            
//             return posts;
//         } catch (error) {
//             console.log("Appwrite service :: getPosts :: error", error);
//             return false;
//         }
//     }

//     async getCollaboratedPosts(userEmail) {
//         try {
//             // First get all collaborations for this user
//             const collaborations = await this.databases.listDocuments(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollaborationId,
//                 [
//                     Query.equal('inviteeEmail', userEmail),
//                     Query.equal('status', 'accepted')
//                 ]
//             );

//             // Get all posts that user is collaborating on
//             const postIds = collaborations.documents.map(collab => collab.postId);
//             if (postIds.length === 0) return { documents: [] };

//             const posts = await this.databases.listDocuments(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 [
//                     Query.equal('$id', postIds)
//                 ]
//             );

//             // Add isCollaborator flag to each post
//             posts.documents = posts.documents.map(post => ({
//                 ...post,
//                 isCollaborator: true
//             }));

//             return posts;
//         } catch (error) {
//             console.log("Appwrite service :: getCollaboratedPosts :: error", error);
//             return false;
//         }
//     }

//     async getPosts(queries = [Query.equal("status", "active")]){
//         try {
//             return await this.databases.listDocuments(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 queries,
                

//             )
//         } catch (error) {
//             console.log("Appwrite serive :: getPosts :: error", error);
//             return false
//         }
//     }

//     // file upload service

//     async uploadFile(file){
//         try {
//             return await this.bucket.createFile(
//                 conf.appwriteBucketId,
//                 ID.unique(),
//                 file
//             )
//         } catch (error) {
//             console.log("Appwrite serive :: uploadFile :: error", error);
//             return false
//         }
//     }

//     async deleteFile(fileId){
//         try {
//             await this.bucket.deleteFile(
//                 conf.appwriteBucketId,
//                 fileId
//             )
//             return true
//         } catch (error) {
//             console.log("Appwrite serive :: deleteFile :: error", error);
//             return false
//         }
//     }

//     getFilePreview(fileId){
//         return this.bucket.getFilePreview(
//             conf.appwriteBucketId,
//             fileId
//         )
//     }
// }


// const service = new Service()
// export default service