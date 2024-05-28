import  express, { NextFunction, Request, Response }  from "express";
import  bodyParser  from "body-parser";
import { UserController } from "./controllers/UserController";
import { PageController } from "./controllers/PageController";
import { ProductController } from "./controllers/ProductController";
import { LocalStorage } from "node-localstorage";
import { AdminController } from "./controllers/AdminController";

export class Server{
    private app = express();
    private port:number = 5000;

    public start(){
        global.localStorage = new LocalStorage("./storage");
        // var user = JSON.parse(localStorage.getItem("user")||"").id;
        this.app.set('view engine', 'ejs');
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use('/public', express.static('public'));

        this.app.use(function(req:Request, res:Response, next:NextFunction){
            res.locals.baseUrl = 'http://localhost:5000/';
            res.locals.user = JSON.parse(localStorage.getItem('user')||'{"id":-1}')
            next()
        });

        this.app.get('/', new PageController().index);
        this.app.get('/login', new UserController().login);
        this.app.get('/logout', new UserController().logout);
        this.app.post('/login', new UserController().login);
        
        this.app.get('/register', new UserController().register);
        this.app.post('/register', new UserController().register);

        this.app.get('/detail/:id', new ProductController().detail);
        this.app.post('/detail/:id', new ProductController().addToCart);

        this.app.get('/cart', new ProductController().cart);
        this.app.get('/cart/:index/:action', new ProductController().updateCart);

        this.app.get('/cart/delete', new ProductController().deleteCart);
        this.app.get('/cart/checkout', new ProductController().checkout);

        this.app.get('/admin',new AdminController().dashboard);
        this.app.get('/admin/order',new AdminController().order);

        this.app.get('/admin/user',new AdminController().user);


        this.app.get('/admin/product',new AdminController().product);
        this.app.get('/admin/product/:id/update',new AdminController().productUpdate);
        this.app.get('/admin/product/:id/delete',new AdminController().productDelete);
        this.app.post('/admin/product/:id/update',new AdminController().productUpdate);

        this.app.get('/admin/product/add',new AdminController().productAdd);
        this.app.post('/admin/product/add',new AdminController().productAdd);

        this.app.get('/admin/order/:id',new AdminController().orderDetail);
        this.app.post('/admin/order/:id',new AdminController().orderUpdate);

        this.app.listen(this.port,()=>{
            console.log(`App đang chạy: http://localhost:${this.port}`);
        });
    }
}