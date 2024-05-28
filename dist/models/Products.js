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
exports.Products = void 0;
const Database_1 = require("../Database");
let DB = new Database_1.Database();
class Products {
    constructor(name, price, type, image) {
        this.name = name;
        this.price = price;
        this.type = type;
        this.image = image;
    }
    static getAllByType(type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB.getData(`/products?type=${type}`);
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB.getData(`/products/${id}`);
        });
    }
}
exports.Products = Products;
