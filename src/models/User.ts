import { Database } from "../Database";
let DB = new Database();
export class User{
    protected id?:string;
    protected email:string;
    protected password:string;
    protected name?: string;
    protected role?:"Admin"|"User";

    public constructor(email:string, password:string,name?:string,role?:"Admin"|"User"){
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
    }
    public async login(){
        let data = await DB.getData(`/users?email=${this.email}&password=${this.password}`);
        // console.log(data);
        
        if(data.length==1){
            this.id=data[0].id;
            this.name=data[0].name;
            this.role=data[0].role;
            return data[0];
        }else{
            return false;
        };    
    }
    public async register(){
        let data = await DB.inserData(`/users`, this);
        console.log('id' in data);
        return true;
    }
    public static async getAll_user(){
        return await DB.getData(`/users`);
    }
}