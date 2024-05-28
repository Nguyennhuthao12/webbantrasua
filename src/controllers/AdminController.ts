import { Request, Response } from "express";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { User } from "../models/User";

export class AdminController{
    //don hàng
    public async dashboard(req:Request, res:Response){
        let dsDH:Order[] = await Order.getNewOrder(5);
        let statusText = {
            'order':'Đã tiếp nhận',
            'shipping':'Đang giao hàng',
            'success':'Giao thành công',
            'cancle':'Đơn bị huỷ'
        }
        res.render('admin_dashboard',{
            title:'Trang quản trị',
            message:'',
            dsDH: dsDH,
            statusText:statusText,
        })
    }

    //quản lý DH 
    public async order(req:Request, res:Response){
        let dsDH:Order[] = await Order.getNewOrder(5);
        let statusText = {
            'order':'Đã tiếp nhận',
            'shipping':'Đang giao hàng',
            'success':'Giao thành công',
            'cancle':'Đơn bị huỷ'
        }
        res.render('admin_order',{
            title:'Quản lý đơn hàng',
            message:'',
            dsDH: dsDH,
            statusText:statusText,
        })
    }
    //quản lý sản phẩm 
    public async user(req:Request, res:Response){
        let dsTK:User[] = await User.getAll_user();
        res.render('admin_user',{
            title:'Quản lý tài khoản',
            dsTK:dsTK,
        })
    }
    //quản lý sản phẩm 
    public async product(req:Request, res:Response){
        let dsSP:Product[] = await Product.getAll();
        res.render('admin_product',{
            title:'Quản lý sản phẩm',
            dsSP:dsSP,
        })
    }
    //sua sản phẩm
    public async productUpdate(req:Request, res:Response){
        let id:string = req.params.id
        let product:Product = new Product();
        product.id = id;
        await product.getDetail();
        if(req.body.name && req.body.price && req.body.type){
            product.name = req.body.name;
            product.price = req.body.price;
            product.type = req.body.type;
            await product.update();
            res.redirect(`/admin/product/${id}/update`)
        }
        res.render('admin_product_update',{
            title:'cập nhật sản phẩm #'+id,
            product:product,
        })
    }
    //them san pham
    public async productAdd(req:Request, res:Response){
        if(req.body.name && req.body.price && req.body.type){
            let product:Product = new Product(
                req.body.name,
                req.body.price,
                req.body.type,
                '1639377770_cfsua-nong_400x400.jpg'
            ); 
            await product.add();
            res.redirect(`/admin/product`)
        }
        res.render('admin_product_add',{
            title:'Tạo sản phẩm',
        })
    }
    //xoa sane pham

    public async productDelete(req:Request, res:Response){
        await Product.delete(req.params.id)
        res.redirect('/admin/product');
   
    }
    //thog tin chi tiet don hang
    public async orderDetail(req:Request, res:Response){
        let id:string = req.params.id;
        let order:Order = new Order();
        order.id = id;
        await order.getDetail();
        res.render('admin_order_detail',{
            title:'chi tiet don hang #'+id,
            order:order,
        })
    }

    // nhat don hàng
    public async orderUpdate(req:Request, res:Response){
        let status: "cart"|"order"|"shipping"|"success"|"cancle" = req.body.status;
        let id:string = req.params.id;
        let order:Order = new Order();
        order.id = id;
        await order.getDetail();
        order.status = status;
        await order.updateCart();
        res.redirect(`/admin/order/${id}`);
    }
}

