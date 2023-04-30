
function required(inputValue) {
    if (inputValue.constructor.name === "String") {
        inputValue = inputValue.trim()
    }
    return inputValue ? null : "You must provide a value"
}


function minLength(len) {
    return function (inputValue) {
        if (!(inputValue && inputValue.constructor.name === "String" && inputValue.trim().length >= len))
            return `value length must be greater than ${len}`
        else return null
    }
}
function maxLength(len) {
    return function (inputValue) {
        if (!(inputValue && inputValue.constructor.name === "String" && inputValue.trim().length >= len))
            return `value length must be less than ${len}`
        else return null
    }
}

function minDate(minDateStr) {
    return function (inputValue) {
        if (new Date(minDateStr) > new Date(inputValue))
            return `value must be greater than ${new Date(minDateStr).toLocaleDateString()}`
        else return null
    }
}
function maxDate(maxDateStr) {
    return function (inputValue) {
        if (new Date(maxDateStr) < new Date(inputValue))
            return `value must be less than ${new Date(maxDateStr).toLocaleDateString()}`
        else return null
    }
}

function isEmail(inputValue) {
    let emailRgx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    if (!emailRgx.test(inputValue)) {
        return `value must be valid Email`
    } else {
        return null
    }
}


export { required, minLength, maxLength, minDate, maxDate, isEmail }