const express = require("express");

const Contenedor = require("../Contenedor");

const router = express.Router();

let contenedor = new Contenedor("contenedor");

router.get("/", (req, res) => {
    (async () => {
        await contenedor.getAll().then((response) => {
            res.json(response);
        });
    })();
});

router.get("/:id", (req, res) => {
    const { id } = req.params;
    const idParse = parseInt(id);

    (async () => {
        await contenedor.getById(idParse).then((response) => {
            if (!response) {
                res.send({ error: "producto no encontrado" });
            }
            res.json(response);
        });
    })();
});

router.post("/", (req, res) => {
    const { body } = req;

    (async () => {
        await contenedor.save(body).then((response) => {
            res.json(response);
        });
    })();
    res.redirect("/api/productos");
});

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { body } = req;

    const idParse = parseInt(id);

    (async () => {
        await contenedor.editProduct(idParse, body).then((response) => {
            res.json(response);
        });
    })();
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const idParse = parseInt(id);

    (async () => {
        await contenedor.deleteById(idParse).then((response) => {
            res.json(response);
        });
    })();
});

module.exports = router;
