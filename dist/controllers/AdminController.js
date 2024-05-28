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
exports.AdminController = void 0;
const Order_1 = require("../models/Order");
const Product_1 = require("../models/Product");
const User_1 = require("../models/User");
class AdminController {
    //don hàng
    dashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let dsDH = yield Order_1.Order.getNewOrder(5);
            let statusText = {
                'order': 'Đã tiếp nhận',
                'shipping': 'Đang giao hàng',
                'success': 'Giao thành công',
                'cancle': 'Đơn bị huỷ'
            };
            res.render('admin_dashboard', {
                title: 'Trang quản trị',
                message: '',
                dsDH: dsDH,
                statusText: statusText,
            });
        });
    }
    //quản lý DH 
    order(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let dsDH = yield Order_1.Order.getNewOrder(5);
            let statusText = {
                'order': 'Đã tiếp nhận',
                'shipping': 'Đang giao hàng',
                'success': 'Giao thành công',
                'cancle': 'Đơn bị huỷ'
            };
            res.render('admin_order', {
                title: 'Quản lý đơn hàng',
                message: '',
                dsDH: dsDH,
                statusText: statusText,
            });
        });
    }
    //quản lý sản phẩm 
    user(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let dsTK = yield User_1.User.getAll_user();
            res.render('admin_user', {
                title: 'Quản lý tài khoản',
                dsTK: dsTK,
            });
        });
    }
    //quản lý sản phẩm 
    product(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let dsSP = yield Product_1.Product.getAll();
            res.render('admin_product', {
                title: 'Quản lý sản phẩm',
                dsSP: dsSP,
            });
        });
    }
    //sua sản phẩm
    productUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            let product = new Product_1.Product();
            product.id = id;
            yield product.getDetail();
            if (req.body.name && req.body.price && req.body.type) {
                product.name = req.body.name;
                product.price = req.body.price;
                product.type = req.body.type;
                yield product.update();
                res.redirect(`/admin/product/${id}/update`);
            }
            res.render('admin_product_update', {
                title: 'cập nhật sản phẩm #' + id,
                product: product,
            });
        });
    }
    //them san pham
    productAdd(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.name && req.body.price && req.body.type) {
                let product = new Product_1.Product(req.body.name, req.body.price, req.body.type, '1639377770_cfsua-nong_400x400.jpg');
                yield product.add();
                res.redirect(`/admin/product`);
            }
            res.render('admin_product_add', {
                title: 'Tạo sản phẩm',
            });
        });
    }
    //xoa sane pham
    productDelete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Product_1.Product.delete(req.params.id);
            res.redirect('/admin/product');
        });
    }
    //thog tin chi tiet don hang
    orderDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            let order = new Order_1.Order();
            order.id = id;
            yield order.getDetail();
            res.render('admin_order_detail', {
                title: 'chi tiet don hang #' + id,
                order: order,
            });
        });
    }
    // nhat don hàng
    orderUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let status = req.body.status;
            let id = req.params.id;
            let order = new Order_1.Order();
            order.id = id;
            yield order.getDetail();
            order.status = status;
            yield order.updateCart();
            res.redirect(`/admin/order/${id}`);
        });
    }
}
exports.AdminController = AdminController;
