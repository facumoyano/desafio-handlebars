const express = require("express");
const { engine } = require("express-handlebars");
const productsRouter = require("./routes/products");
const Contenedor = require("./Contenedor");

const app = express();

const PORT = 8080;

let contenedor = new Contenedor("contenedor");

const server = app.listen(PORT, () => {
    console.log(
        `Servidor http escuchando en el puerto ${server.address().port}`
    );
});
server.on("error", (error) => console.log(`error ${error}`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));

app.set("view engine", "hbs");
app.set("views", "./views");
app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname + "/views/layouts",
        partialsDir: __dirname + "/views/partials",
    })
);

app.get("/", function (req, res) {
    res.render("form");
});

app.get("/productos", (req, res) => {
    (async () => {
        await contenedor.getAll().then((response) => {
            if (response) {
                res.render("productlist", {
                    products: response,
                    productsExist: true,
                });
            } else {
                res.render("error", {
                    message: "No hay productos",
                });
            }
        });
    })();
});

app.post("/api/productos", (req, res) => {
    const { body } = req;

    (async () => {
        await contenedor.save(body).then((response) => {
            res.json(response);
        });
    })();
    res.redirect("/productos");
});

app.use("/api/productos", productsRouter);
