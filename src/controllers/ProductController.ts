import { Request, Response } from "express";
import { Product } from "../models/Product";
import { Order } from "../models/Order";

export class ProductController{
    public async detail(req:Request ,res:Response){
        let id:string = req.params.id;
        let sp:Product = await Product.getById  (id);
        let dsTP:Product[] = await Product.getAllByType('topping');
        res.render("product_detail",{
            title:'Sản phẩm #'+id,
            sp: sp,
            dsTP: dsTP,
        });
    }
    public async cart(req:Request ,res:Response){
        let idUser:string = JSON.parse(localStorage.getItem("user")||'{"id":-1}').id;
        let cartData = await Order.hasCart(idUser);
        let cart = new Order([]);
        if(cartData){
            cart.copy(cartData);
        }
        res.render('product_cart',{
            title:'Giỏ hàng',
            cart: cart,
        });
    }
    public async addToCart(req:Request ,res:Response){
        let id:string = req.params.id;
        let toppingIdList:string[] = req.body.toppingList;
        // let quantity:number = req.body.quantity;
        let toppingList:Product[] = [];

        let productData:Product = await Product.getById(id) as Product;
        let product = new Product();
        product.copy(productData);
        product.quantity = Number(req.body.quantity);
        if(toppingIdList){
            if(!Array.isArray(toppingIdList)){
                // nếu ko phải mảng thi tạo mảng
                //do người dùng thì chọn 1 topping
               toppingIdList = [toppingIdList];
            }
            for(const idTP of toppingIdList){       
                let topping = await Product.getById(idTP);
                toppingList.push(topping);
            }
            product.addToTopping(toppingList);
        }
        let idUser:string = JSON.parse(localStorage.getItem("user")||'{"id":-1}').id;//giả sử dang nhap bằng user id 1
        let cart:Order = await Order.hasCart(idUser) as unknown as Order;

        if( !cart ){
            // nếu chua có gio hàng -> tạo giỏ hàng
            cart = new Order([product], idUser);
            cart.createCart();
        }else{
            //da có giỏ hàng thâm sản phẩm
            let dataCart = cart;
            cart = new Order();
            cart.copy(dataCart);
            cart.addProduct(product);
            console.log(cart);
            // res.send('them thanh cong!');
        }
        res.redirect(`/detail/${id}`);
    }
    public async updateCart(req:Request ,res:Response){
        // let userId:string = '1';
        let idUser:string = JSON.parse(localStorage.getItem("user")||'{"id":-1}').id;//giả sử dang nhap bằng user id 1
        let cartData = await Order.hasCart(idUser);
        let cart = new Order();
        if(cartData){
            cart.copy(cartData);
        }
        let indexSP:number = Number(req.params.index);
        if(cart.products){
            if(req.params.action=='up'){
                cart.products[indexSP].quantity++;
            }
            else if(req.params.action=='down'){
                if(cart.products[indexSP].quantity>1)
                cart.products[indexSP].quantity--;
            }
            else if(req.params.action=='delete'){
                cart.products?.splice(indexSP,1);
            }
        }
       await cart.updateCart();
        res.redirect('/cart');
    }
    public async deleteCart(req:Request ,res:Response){
        let idUser:string = JSON.parse(localStorage.getItem("user")||'{"id":-1}').id;
        let cartData = await Order.hasCart(idUser);
        if(cartData){// nếu có cart thì xoá
            if(cartData.id){
                await Order.deleteCart(cartData.id);
                res.redirect('/cart');
            }
        }
    }

    public async checkout(req:Request ,res:Response){
        let idUser:string = JSON.parse(localStorage.getItem("user")||'{"id":-1}').id;
        let cartData = await Order.hasCart(idUser);
        let order = new Order();
        if(cartData){
            order.copy(cartData);
            if(order.products && order.products.length>0){
                let tongTien = 0;
                order.products.forEach(sp =>{
                    let gia=0;
                    if(sp.price) tongTien+=sp.price;

                    sp.topping.forEach(tp =>{
                        if(tp.price) gia+=tp.price
                    });
                    tongTien += gia*sp.quantity;
                });
                order.totcal=tongTien;
                order.date = new Date().toLocaleString('sv-SE');
                order.status = "order";
                await order.updateCart();
                //nên chuyển trang về thông báo đặt hàng thành công
                res.send('Đặt hàng thành công');
            }
        }
        res.redirect('/cart');
    }
    
}
