import conf from "../conf/conf.js";
import decodeJWT from "../util/decodeJWT.js";

const{backendUrl}=conf;

export class AuthService {

    async createAccount({email, password, name}) {
        try {
            const response = await fetch(`${backendUrl}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,      
                    email: email,
                    password: password,
                }),
            });
    
            const data = await response.json(); 
            // console.log("dataaaaa: ", data);
            console.log(response);
            if (!response.ok) {
                return {status:response.status,message:data.message}
                
            } else {
                const loginData=this.login({email,password});
                return {loginData:loginData.userData,status:response.status,message:data.message};

            }
        } catch (err) {
            console.error("Catch block error:", err);
            alert("Something went wrong. Try again.");
        }
    }

    async login({email, password}) {
        try {
            const response=await fetch(`${backendUrl}/api/auth/login`,{
                method:'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({      
                    email: email,
                    password: password,
                }),
            });
            const data=await response.json();
            if(!response.ok){
                return {message:data.message,status:response.status};
            }

            localStorage.setItem("token",data.token);
            return {userData:data.user,message:data.message,status:response.status};
                                                                                                                                                                                                                                                                                                                                                                                                                                       
        } catch (error) {
            console.log("internal server errror::: ",error);
        }
    }

    async logout() {
        localStorage.removeItem("token");
    }

    
    async getCurrentUser() {
        try {
            const token=localStorage.getItem("token");
            const userData=await decodeJWT(token);
            console.log(userData,"aaaaaaaaaaa");
            return userData;
        } catch (error) {
            console.log("get current user error ", error);
        }

    return null;
    }
}

const authService = new AuthService();

export default authService













// import conf from '../conf/conf.js';
// import { Client, Account, ID } from "appwrite";


// export class AuthService {
//     client = new Client();
//     account;

//     constructor() {
//         this.client
//             .setEndpoint(conf.appwriteUrl)
//             .setProject(conf.appwriteProjectId);
//         this.account = new Account(this.client);
            
//     }

//     async createAccount({email, password, name}) {
//         try {
//             const userAccount = await this.account.create(ID.unique(), email, password, name);
//             if (userAccount) {
//                 // call another method
//                 return this.login({email, password});
//             } else {
//                return  userAccount;
//             }
//         } catch (error) {
//             throw error;
//         }
//     }

//     async login({email, password}) {
//         try {
//             return await this.account.createEmailSession(email, password);
//         } catch (error) {
//             throw error;
//         }
//     }

//     async getCurrentUser() {
//         try {
//             return await this.account.get();
//         } catch (error) {
//             console.log("Appwrite serive :: getCurrentUser :: error", error);
//         }

//         return null;
//     }

//     async logout() {

//         try {
//             await this.account.deleteSessions();
//         } catch (error) {
//             console.log("Appwrite serive :: logout :: error", error);
//         }
//     }
// }

// const authService = new AuthService();

// export default authService


