const errorHandler = routerCallBack => {
    return async (req, res, next) => {
        try {
            await routerCallBack(req, res, next);
        } catch (e) {
            res.status(500).send({errorMessage: `${e}`});
        }
    }
};

module.exports = errorHandler;
