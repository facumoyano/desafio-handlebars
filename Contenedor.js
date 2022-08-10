const fs = require("fs");

class Contenedor {
    constructor(archivo) {
        this.archivo = `./${archivo}.json`;
    }

    async getData() {
        try {
            return await fs.promises.readFile(this.archivo, "utf-8");
        } catch (error) {
            if (error.code == "ENOENT") {
                fs.writeFile(this.archivo, "[]", (error) => {
                    if (error) {
                        console.log("El archivo no se pudo crear");
                    }
                });
            }
        }
    }

    async getAll() {
        try {
            const data = await this.getData();
            const dataParse = JSON.parse(data);
            return dataParse;
        } catch (error) {
            console.log(error);
        }
    }

    async save(objeto) {
        try {
            let contenidoDeArchivo = await this.getData();
            let contenidoEnJSON = JSON.parse(contenidoDeArchivo);
            let arreglo = [];
            const indice = contenidoEnJSON.map((x) => x.id).sort();

            objeto.id = indice[indice.length - 1] + 1;

            if (!objeto.id) {
                objeto.id = 1;
                arreglo = [{ ...objeto }];
                await fs.promises.writeFile(
                    this.archivo,
                    JSON.stringify(arreglo)
                );
                return arreglo[0].id;
            }

            contenidoEnJSON.push(objeto);
            await fs.promises.writeFile(
                this.archivo,
                JSON.stringify(contenidoEnJSON)
            );
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id) {
        try {
            let data = await fs.promises.readFile(this.archivo, "utf-8");
            let parsedData = await JSON.parse(data);
            if (parsedData.find((e) => e.id === id)) {
                const itemFind = parsedData.find((e) => e.id === id);
                return itemFind;
            } else {
                console.log("el elemento no existe");
            }
        } catch (error) {
            console.error(error);
        }
    }

    async deleteById(id) {
        try {
            let data = await fs.promises.readFile(this.archivo, "utf-8");
            let parseData = await JSON.parse(data);
            if (parseData.some((x) => x.id === id)) {
                let obj = parseData.find((x) => x.id === id);
                let objPosition = parseData.indexOf(obj);
                parseData.splice(objPosition, 1);
                fs.promises.writeFile(
                    this.archivo,
                    JSON.stringify(parseData, null, 2)
                );
                console.log("el objeto fue eliminado");
                return parseData;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify([]));
            console.log("el contenedor esta vacio");
        } catch (error) {
            console.error(error);
        }
    }

    async editProduct(id, body) {
        try {
            let data = await fs.promises.readFile(this.archivo, "utf-8");
            let parseData = await JSON.parse(data);
            let itemFind = await this.getById(id);
            const productEdit = { ...itemFind, ...body };
            let array = parseData.map((item) => {
                if (item.id === itemFind.id) {
                    item = productEdit;
                    return item;
                } else {
                    return item;
                }
            });
            console.log(array);
            await fs.promises.writeFile(this.archivo, JSON.stringify(array));
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Contenedor;
