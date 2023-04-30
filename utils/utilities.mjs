function getDataFromForm(formElm) {
    let data = {};
    [].forEach.call(formElm.elements, (input) => {
        if (input.name) {
            data[input.name] = input.value
        }
    })
    return data
}

function getValueOfRadio(nameOfRadios) {
    let elements = document.getElementsByName(nameOfRadios);
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].checked) {
            return elements[i].value
        }
    }
}


function sendEmail(emailjs, user) {
    let serviceId = "service_xssw5qg";
    let templateId = "template_b2mv96q";
    let publicKey = "mTjdq9xW2MSmOUkPy"
    emailjs.init(publicKey);
    emailjs.send(serviceId, templateId,
        {
            name: `${user.firstName} ${user.lastName}`,
            username: user.username,
            password: user.password,
            email: user.email
        }
    ).then((res) => {
        console.log(res);
        alert("email sent successfully")
    }).catch((err) => {
        console.error(err);
    })
}

function appendAlert(message, type, destinationElm) {
    const Time = 3000;
    let timerId = setTimeout(() => {
        destinationElm.querySelector(`#alert-${timerId}`).remove()
    }, Time)
    destinationElm.innerHTML += [
        `<div id="alert-${timerId}" class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button"  class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')
    destinationElm.querySelector("button").addEventListener("click", () => {
        clearTimeout(timerId);
    })

}

function numberToWithFixedCountOfDigits(number, numOFDigits) {
    let strNum = number.toString()
    if (numOFDigits < strNum.length) return -1
    return `${"0".repeat(numOFDigits - strNum.length)}${strNum}`
}

function convertDateObjToHTMLStringFormat(dateObj) {
    return `${dateObj.getFullYear()}-${numberToWithFixedCountOfDigits(dateObj.getMonth() + 1, 2)}-${numberToWithFixedCountOfDigits(dateObj.getDate(), 2)}`
}
function eraseSpaces(str) {
    return str.replaceAll(" ", "")
}
function capitalize(str) {
    str = eraseSpaces(str)
    return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`
}

export { capitalize, getDataFromForm, getValueOfRadio, sendEmail, appendAlert, convertDateObjToHTMLStringFormat }