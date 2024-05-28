"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const pageController_1 = require("./controllers/pageController");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = 5000;
    }
    start() {
        this.app.set('view engine', 'ejs');
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
        this.app.use('/public', express_1.default.static('public'));
        this.app.get('/', new pageController_1.PageController().index);
        this.app.listen(this.port, () => {
            console.log(`App đang chạy: http://localhost:${this.port}`);
        });
    }
}
exports.Server = Server;
