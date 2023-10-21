const {categoria} = require('../BD/bd')

exports.traerCategorias = async (req, res) => {
    try {
        const categorias = await categoria.findAll();
        console.log("categorias en el back")
        res.send(categorias);
    } catch (error) {
        throw error;
    }
}