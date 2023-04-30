function validate(arrayOfValidations, value) {
    return arrayOfValidations.reduce((acc, fn) => {
        let res = fn(value)
        if (res) acc.push(res)
        return acc
    }, [])
}

function validationMsg(validationRes) {
    return validationRes.map((msg) => `<p class=" m-0 p-0"><i class="fa-solid fa-xmark"></i> ${msg}</p>`).join(" ")
}

function markElmInvalid(elm) {
    elm.classList.add("is-invalid")
    elm.classList.remove("is-valid")
}

function markElmValid(elm) {
    elm.classList.add("is-valid")
    elm.classList.remove("is-invalid")
}

function addInvalidFeedbackToElm(inputElm, feedback) {
    document.querySelector(`#${inputElm.name}-feedback`).innerHTML = feedback
    inputElm.setCustomValidity(feedback)
}

function validateElmFromSchema(elm, schema) {
    let validationRes = validate(schema[elm.name], elm.value)
    elm.setCustomValidity("");
    if (!elm.checkValidity() || validationRes.length > 0) {
        markElmInvalid(elm)
        if (validationRes.length > 0) {
            let errorMsgs = validationMsg(validationRes)
            addInvalidFeedbackToElm(elm, errorMsgs)
        }
    } else {
        markElmValid(elm)
    }
}

function showServerSideValidation(err, form) {
    if (err.fieldsNames && err.fieldsNames.length > 0) {
        err.fieldsNames.forEach((fieldName) => {
            let inputElm = form.querySelector(`input[name='${fieldName}']`)
            addInvalidFeedbackToElm(inputElm, err.message)
        })
    } else {
        let formFeedbackElm = form.querySelector(`#form-feedback`)
        formFeedbackElm.innerHTML = `<p><i class="fa-solid fa-xmark me-2"></i>${err.message}</p>`
        formFeedbackElm.classList.remove("d-none")
    }
}

function ForEachFormElmThatHaveName(form, callback) {
    [].forEach.call(form.elements, (inputElm) => {
        if (inputElm.name)
            callback(inputElm)
    })
}

function addValidationHandlerToFormElementsAtEvent(from, schema, eventName) {
    ForEachFormElmThatHaveName(from, (inputElm) => {
        inputElm.addEventListener(eventName, (event) => {
            validateElmFromSchema(event.target, schema)
        })
    })
}

function ValidateFormElements(from, schema) {
    ForEachFormElmThatHaveName(from, (inputElm) => {
        validateElmFromSchema(inputElm, schema)
    })
}

function resetForm(form) {
    ForEachFormElmThatHaveName(form, (inputElm) => {
        inputElm.value = "";
        inputElm.classList.remove("is-valid");
        inputElm.classList.remove("is-invalid");

    })
    form.classList.remove("was-validated");
}

export { resetForm, addValidationHandlerToFormElementsAtEvent, ValidateFormElements, showServerSideValidation }