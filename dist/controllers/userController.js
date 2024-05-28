"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = require("../models/User");
class UserController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let email = req.body.email;
            let password = req.body.password;
            if (email && password) {
                // res.send(`email là: ${email} - Mật khẩu là: ${password}`);
                let user = new User_1.User(email, password);
                if (yield user.login()) {
                    localStorage.setItem("user", JSON.stringify(user));
                    res.redirect('/'); //redirect chuyển trang
                }
                else {
                    res.render('user_login', {
                        title: "Đăng nhập",
                        message: 'Email hoăc mật khẩu ko đúng'
                    });
                }
            }
            else {
                res.render('user_login', {
                    title: "Đăng nhập",
                    message: ''
                });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            localStorage.removeItem("user");
            res.redirect("/login");
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let name = req.body.name;
            let email = req.body.email;
            let password = req.body.password;
            let password2 = req.body.password2;
            //có truyền dữ liệu
            if (name && email && password && password2) {
                let message = '';
                if (password == password2) {
                    let user = new User_1.User(email, password, name, 'User');
                    if (yield user.register()) {
                        res.redirect('/login');
                    }
                    else {
                        message = 'Đăng ký không thành công vui lòng thử lại sau!!';
                    }
                }
                else {
                    message = 'Mật khẩu không khớp';
                }
                res.render('user_register', {
                    title: 'Đăng Ký',
                    message: message
                });
            }
            else {
                res.render('user_register', {
                    title: 'Đăng Ký',
                    message: ''
                });
            }
        });
    }
}
exports.UserController = UserController;
