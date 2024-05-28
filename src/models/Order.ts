import { Product } from "./Product";
import { Database } from "../Database";
let DB = new Database();
export class Order{
    // addProduct(product: Product) {
    //     throw new Error("Method not implemented.");
    // }
    public id?:string;
    public products?:Product[];
    protected idUser?:string;
    public totcal:number;
    public date:string;
    public status:"cart"|"order"|"shipping"|"success"|"cancle";
    public constructor(products?:Product[],idUser?:string){
        this.products=products;
        this.idUser=idUser;
        this.totcal=0;
        this.date = new Date().toLocaleString('sv-SE');
        this.status = "cart";
    }
    public static async hasCart(idUser:string){
       let data = await DB.getData(`/orders?idUser=${idUser}&status=cart`) as Order[];
       if(data.length==0){ //ko có cart
            return false;
       }else{//có cart
        return data[0];
       }
    }
    public copy(order:Order){
        this.id = order.id;
        this.products = order.products;
        this.idUser = order.idUser;
        this.totcal = order.totcal; 
        this.date = order.date;
        this.status = order.status;
    }

    public static async getNewOrder(limit=-1){
        return await DB.getData(`/orders?_sort=-date&status_ne=cart&_limit=${limit}`);
    }

    public async getDetail(){
        let data = await DB.getData(`/orders/${this.id}`);
        this.products = data.products;
        this.idUser = data.idUser;
        this.totcal = data.totcal;
        this.date = data.date;
        this.status = data.status;    
    }

    public async createCart(){
        return await DB.inserData<Order>(`/orders`, this);
    };

    public async updateCart(){
        return await DB.updateData<Order>(`/orders/${this.id}`, this);
    };

    public static async deleteCart(id:string){
        return await DB.deletaData(`/orders/${id}`);
    };

    public async addProduct(product:Product){
        if( this.products ){
            let inCart:Boolean = false;// giả sử chua có triong cart
            for(const sp of this.products){
                if(sp.id == product.id){
                // check 2 mảng topping có trùng nhau ko
                // sp.topping và product.topping
                //[đào, vãi] và [vải, đào]
                let count:number = 0;
                    for (const tp1 of sp.topping){
                        for(const tp2 of product.topping){
                            if(tp1.id == tp2.id){
                                count++;
                            }
                        }
                    }
                    if(count == sp.topping.length)
                    inCart = true
                    sp.quantity += product.quantity;
                    break;
                }
            }
            if(!inCart){
                this.products.push(product);
            }   
        }
        return await DB.updateData<Order>(`/orders/${this.id}`,this);
    }
};




