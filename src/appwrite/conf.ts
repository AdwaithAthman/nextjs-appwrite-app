import conf from "@/conf/conf";
import { Client, Account, ID } from "appwrite";

type CreateUserAccount = {
    email: string,
    password: string,
    name: string
}

type LoginUserAccount = {
    email: string,
    password: string
}

const appwriteClient = new Client();

appwriteClient
    .setEndpoint(conf.appWriteUrl)
    .setProject(conf.appWriteProjectId);

export const account = new Account(appwriteClient);

class AppwriteService {
    //create a new record of user inside appwrite
    async createUserAccount({ email, password, name}: CreateUserAccount){
        try{
            const userAccount = await account.create(ID.unique(), email, password, name);
            if(userAccount){
                return this.login({ email, password});
            }
            else{
                return userAccount;
            }
        }
        catch(error){
            throw error;
        }
    }

    async login({ email, password }: LoginUserAccount){
        try{
            const userAccount = await account.createEmailSession(email, password);
            return userAccount;
        }
        catch(error){
            throw error;
        }
    }

    async isLoggedIn(): Promise<boolean> {
        try{
            const data = this.getCurrentUser();
            return Boolean(data);
        }
        catch(error){};
        return false;
    }

    async getCurrentUser(){
        try{
            return await account.get();
        }
        catch(error){
            console.log("getCurrentUser error: ", error);
            throw error;
        }
    }

    async logout(){
        try{
            return await account.deleteSession("current");
        }
        catch(error){
            console.log("logout error: ", error);
            throw error;
        }
    }

}

const appwriteService = new AppwriteService ();
export default appwriteService;