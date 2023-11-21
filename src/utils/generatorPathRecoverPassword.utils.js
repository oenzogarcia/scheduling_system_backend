const generatorPathRecoverPassword = (
    serveExpressProtocol,
    serverExpressHost,
    serverExpressPort,
    hash
) => {
    return `${serveExpressProtocol}://${serverExpressHost}:${serverExpressPort}/alterar-senha/${hash}`;;
};

module.exports = {
    generatorPathRecoverPassword
};

