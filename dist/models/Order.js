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
exports.Order = void 0;
const Database_1 = require("../Database");
let DB = new Database_1.Database();
class Order {
    constructor(products, idUser) {
        this.products = products;
        this.idUser = idUser;
        this.totcal = 0;
        this.date = new Date().toLocaleString('sv-SE');
        this.status = "cart";
    }
    static hasCart(idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield DB.getData(`/orders?idUser=${idUser}&status=cart`);
            if (data.length == 0) { //ko có cart
                return false;
            }
            else { //có cart
                return data[0];
            }
        });
    }
    copy(order) {
        this.id = order.id;
        this.products = order.products;
        this.idUser = order.idUser;
        this.totcal = order.totcal;
        this.date = order.date;
        this.status = order.status;
    }
    static getNewOrder(limit = -1) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB.getData(`/orders?_sort=-date&status_ne=cart&_limit=${limit}`);
        });
    }
    getDetail() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield DB.getData(`/orders/${this.id}`);
            this.products = data.products;
            this.idUser = data.idUser;
            this.totcal = data.totcal;
            this.date = data.date;
            this.status = data.status;
        });
    }
    createCart() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB.inserData(`/orders`, this);
        });
    }
    ;
    updateCart() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB.updateData(`/orders/${this.id}`, this);
        });
    }
    ;
    static deleteCart(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB.deletaData(`/orders/${id}`);
        });
    }
    ;
    addProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.products) {
                let inCart = false; // giả sử chua có triong cart
                for (const sp of this.products) {
                    if (sp.id == product.id) {
                        // check 2 mảng topping có trùng nhau ko
                        // sp.topping và product.topping
                        //[đào, vãi] và [vải, đào]
                        let count = 0;
                        for (const tp1 of sp.topping) {
                            for (const tp2 of product.topping) {
                                if (tp1.id == tp2.id) {
                                    count++;
                                }
                            }
                        }
                        if (count == sp.topping.length)
                            inCart = true;
                        sp.quantity += product.quantity;
                        break;
                    }
                }
                if (!inCart) {
                    this.products.push(product);
                }
            }
            return yield DB.updateData(`/orders/${this.id}`, this);
        });
    }
}
exports.Order = Order;
;
