import { Request,Response } from "express";
import { User } from "../models/User";
export class UserController{
    public async login(req:Request, res:Response){
        let email:string = req.body.email;
        let password = req.body.password;
        if(email && password){
            // res.send(`email là: ${email} - Mật khẩu là: ${password}`);
            let user:User = new User(email,password);
            if ( await user.login()) {
                localStorage.setItem("user", JSON.stringify(user));
                res.redirect('/');//redirect chuyển trang
            }else{
                res.render('user_login',{
                    title:"Đăng nhập",
                    message:'Email hoăc mật khẩu ko đúng'
                });
            }
        }else{
            res.render('user_login',{
                title:"Đăng nhập",
                message: ''
            });
        }
    }
    public async logout(req:Request, res:Response){
        localStorage.removeItem("user");
        res.redirect("/login");
    }
    public async register(req:Request, res:Response){
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        let password2 = req.body.password2;
        //có truyền dữ liệu
        if(name && email && password && password2){
            let message:string ='';
            if (password==password2) {
                let user = new User(email, password, name,'User');
                if (await user.register()) {
                    res.redirect('/login');
                }else{
                    message = 'Đăng ký không thành công vui lòng thử lại sau!!'
                }
            }else{
                message = 'Mật khẩu không khớp';
            }
            res.render('user_register',{
                title:'Đăng Ký',
                message:message
            })
        }else{
            res.render('user_register',{
                title:'Đăng Ký',
                message:''
            })
        }
    }

    
}