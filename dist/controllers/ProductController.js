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
exports.ProductController = void 0;
const Product_1 = require("../models/Product");
const Order_1 = require("../models/Order");
class ProductController {
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            let sp = yield Product_1.Product.getById(id);
            let dsTP = yield Product_1.Product.getAllByType('topping');
            res.render("product_detail", {
                title: 'Sản phẩm #' + id,
                sp: sp,
                dsTP: dsTP,
            });
        });
    }
    cart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let idUser = JSON.parse(localStorage.getItem("user") || '{"id":-1}').id;
            let cartData = yield Order_1.Order.hasCart(idUser);
            let cart = new Order_1.Order([]);
            if (cartData) {
                cart.copy(cartData);
            }
            res.render('product_cart', {
                title: 'Giỏ hàng',
                cart: cart,
            });
        });
    }
    addToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            let toppingIdList = req.body.toppingList;
            // let quantity:number = req.body.quantity;
            let toppingList = [];
            let productData = yield Product_1.Product.getById(id);
            let product = new Product_1.Product();
            product.copy(productData);
            product.quantity = Number(req.body.quantity);
            if (toppingIdList) {
                if (!Array.isArray(toppingIdList)) {
                    // nếu ko phải mảng thi tạo mảng
                    //do người dùng thì chọn 1 topping
                    toppingIdList = [toppingIdList];
                }
                for (const idTP of toppingIdList) {
                    let topping = yield Product_1.Product.getById(idTP);
                    toppingList.push(topping);
                }
                product.addToTopping(toppingList);
            }
            let idUser = JSON.parse(localStorage.getItem("user") || '{"id":-1}').id; //giả sử dang nhap bằng user id 1
            let cart = yield Order_1.Order.hasCart(idUser);
            if (!cart) {
                // nếu chua có gio hàng -> tạo giỏ hàng
                cart = new Order_1.Order([product], idUser);
                cart.createCart();
            }
            else {
                //da có giỏ hàng thâm sản phẩm
                let dataCart = cart;
                cart = new Order_1.Order();
                cart.copy(dataCart);
                cart.addProduct(product);
                console.log(cart);
                // res.send('them thanh cong!');
            }
            res.redirect(`/detail/${id}`);
        });
    }
    updateCart(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // let userId:string = '1';
            let idUser = JSON.parse(localStorage.getItem("user") || '{"id":-1}').id; //giả sử dang nhap bằng user id 1
            let cartData = yield Order_1.Order.hasCart(idUser);
            let cart = new Order_1.Order();
            if (cartData) {
                cart.copy(cartData);
            }
            let indexSP = Number(req.params.index);
            if (cart.products) {
                if (req.params.action == 'up') {
                    cart.products[indexSP].quantity++;
                }
                else if (req.params.action == 'down') {
                    if (cart.products[indexSP].quantity > 1)
                        cart.products[indexSP].quantity--;
                }
                else if (req.params.action == 'delete') {
                    (_a = cart.products) === null || _a === void 0 ? void 0 : _a.splice(indexSP, 1);
                }
            }
            yield cart.updateCart();
            res.redirect('/cart');
        });
    }
    deleteCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let idUser = JSON.parse(localStorage.getItem("user") || '{"id":-1}').id;
            let cartData = yield Order_1.Order.hasCart(idUser);
            if (cartData) { // nếu có cart thì xoá
                if (cartData.id) {
                    yield Order_1.Order.deleteCart(cartData.id);
                    res.redirect('/cart');
                }
            }
        });
    }
    checkout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let idUser = JSON.parse(localStorage.getItem("user") || '{"id":-1}').id;
            let cartData = yield Order_1.Order.hasCart(idUser);
            let order = new Order_1.Order();
            if (cartData) {
                order.copy(cartData);
                if (order.products && order.products.length > 0) {
                    let tongTien = 0;
                    order.products.forEach(sp => {
                        let gia = 0;
                        if (sp.price)
                            tongTien += sp.price;
                        sp.topping.forEach(tp => {
                            if (tp.price)
                                gia += tp.price;
                        });
                        tongTien += gia * sp.quantity;
                    });
                    order.totcal = tongTien;
                    order.date = new Date().toLocaleString('sv-SE');
                    order.status = "order";
                    yield order.updateCart();
                    //nên chuyển trang về thông báo đặt hàng thành công
                    res.send('Đặt hàng thành công');
                }
            }
            res.redirect('/cart');
        });
    }
}
exports.ProductController = ProductController;
