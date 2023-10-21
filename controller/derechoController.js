const {derechos} = require('../BD/bd')
exports.traerDerechos = async (req, res) => {
    try {
        const derecho = await derechos.findAll();
        console.log("derechos en el back")
        res.send(derecho);
    } catch (error) {
        throw error;
    }
}