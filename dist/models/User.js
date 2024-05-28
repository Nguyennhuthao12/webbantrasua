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
exports.User = void 0;
const Database_1 = require("../Database");
let DB = new Database_1.Database();
class User {
    constructor(email, password, name, role) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield DB.getData(`/users?email=${this.email}&password=${this.password}`);
            // console.log(data);
            if (data.length == 1) {
                this.id = data[0].id;
                this.name = data[0].name;
                this.role = data[0].role;
                return data[0];
            }
            else {
                return false;
            }
            ;
        });
    }
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield DB.inserData(`/users`, this);
            console.log('id' in data);
            return true;
        });
    }
    static getAll_user() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB.getData(`/users`);
        });
    }
}
exports.User = User;
