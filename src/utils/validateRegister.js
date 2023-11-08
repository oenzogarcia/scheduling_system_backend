const validateRegister = (data, array) => {

    const temUndefined = data.some(data => {
        return data == undefined
    })

    if (temUndefined) {
        return true
    } else {
        return false
    }
}

module.exports = validateRegister