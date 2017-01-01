'use strict'

// Ici votre code : remplacer ce module par votre code à vous

function isDefined(object) {
    return (typeof object !== 'undefined' || object)
}

function isValidEmail(email) {
    return validator.isEmail(email)
}

/**
 * Returns wether the given date is a valid date in the future
 */
function isValidFutureDate(date) {
    return validator.isDate(date.toString()) && validator.isAfter(date.toString())
}

function isValidId(id) {
    return validator.isNumeric(id)
}

function isEmpty(str) {
  return validator.isEmpty(str)
}

exports.isValidEmail = isValidEmail
exports.isValidFutureDate = isValidFutureDate
exports.isDefined = isDefined
exports.isValidId = isValidId
exports.isEmpty = isEmpty
