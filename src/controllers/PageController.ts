import { Request, Response } from "express";
import { Product } from "../models/Product";
export class PageController{
    public async index(req:Request ,res:Response){
        let dsSP:Product[] = await Product.getAllByType('drink');
        res.render("page_index",{
            title:'Trang chủ',
            dsSP:dsSP
        });
    }
}