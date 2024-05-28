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
exports.Product = void 0;
const Database_1 = require("../Database");
let DB = new Database_1.Database();
class Product {
    constructor(name, price, type, image) {
        this.topping = [];
        this.quantity = 0;
        this.name = name;
        this.price = price;
        this.type = type;
        this.image = image;
    }
    copy(product) {
        this.id = product.id;
        this.name = product.name;
        this.price = product.price;
        this.type = product.type;
        this.image = product.image;
        this.topping = product.topping || [];
    }
    addToTopping(topping) {
        if (Array.isArray(topping)) {
            this.topping.push(...topping);
        }
        else {
            this.topping.push(topping);
        }
    }
    // public static async getAllByType(type:"drink"|"topping"){
    //     let data = await DB.getData(`/products?type=${type}`);
    //     if(data.length==0){ // chua co 
    //         return false;
    //     }else{ // da co -> tra ve gio hang 
    //         return data[0];
    //     }
    // }
    static getAllByType(type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB.getData(`/products?type=${type}`);
        });
    }
    // lấy hết sản phẩm
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB.getData(`/products`);
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB.getData(`/products/${id}`);
        });
    }
    getDetail() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield DB.getData(`/products/${this.id}`);
            this.name = data.name;
            this.price = data.price;
            this.type = data.type;
            this.image = data.image;
            this.topping = data.topping || [];
        });
    }
    //update
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB.updateData(`/products/${this.id}`, this);
        });
    }
    add() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB.inserData(`/products`, this);
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB.deletaData(`/products/${id}`);
        });
    }
    static search(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB.getData(`/products/${id}`);
        });
    }
}
exports.Product = Product;
