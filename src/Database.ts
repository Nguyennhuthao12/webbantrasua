export class Database{
    protected APIurl:string = 'http://localhost:3000';
    public async getData(url:string){
       return await fetch(this.APIurl+url).then((res:Response)=>res.json());
    }
    public async inserData<T>(url:string, data:T){
        return await fetch(this.APIurl+url,{
            method:'POST',
            body:JSON.stringify(data),
        }).then((res:Response)=>res.json());
     }
     public async updateData<T>(url:string, data:T):Promise<T>{
        return await fetch(this.APIurl+url,{
            method:'PATCH',//pot: thay thế || PATCH:sửa thông tin dc truyền lên
            body:JSON.stringify(data),
        }).then((res:Response)=>res.json());
     }
     public async deletaData(url:string){
        return await fetch(this.APIurl+url,{
            method:'DELETE',//pot: thay thế || PATCH:sửa thông tin dc truyền lên
        }).then((res:Response)=>res.json());
     }
}