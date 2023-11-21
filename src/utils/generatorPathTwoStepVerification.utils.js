const generatorPathTwoStepVerification = (
    serveExpressProtocol,
    serverExpressHost,
    serverExpressPort,
    hash
) => {
    return `${serveExpressProtocol}://${serverExpressHost}:${serverExpressPort}/user/verification-account/${hash}`;;
};



module.exports = {
    generatorPathTwoStepVerification
};

