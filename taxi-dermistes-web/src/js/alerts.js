'use strict'

var gen = require('./general.js')

var countError = 0
var messagesAlert = []

function setStatusForm(statut, nomChamp, idForm) {
    var champForm = $("#" + idForm + " [name='" + nomChamp + "']")
    var divParent = champForm.parent()

    if (statut == "default") {
        divParent.removeClass("has-success has-error has-danger")
        divParent.find(".form-control-feedback").remove()
    } else if (statut == "success") {
        setStatusForm("default", nomChamp, idForm)
        divParent.addClass("has-success has-feedback")
        divParent.append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>')
    } else if (statut == "error") {
        setStatusForm("default", nomChamp, idForm)
        divParent.addClass("has-error has-feedback")
        divParent.append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>')
    } else if (statut == "warning") {
        setStatusForm("default", nomChamp, idForm)
        divParent.addClass("has-warning has-feedback")
        divParent.append('<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true"></span>')
    }

}

function setStatusFormAll(statut, idForm) {
    var form = gen.formToJSON($("#" + idForm))
    for (var nomChamp in form) {
        setStatusForm(statut, nomChamp, idForm)
    }
}

function setAlert(statut, messages, id) {
    var str = "<ul>"
    for (var i = 0; i < messages.length; i++) {
        str += "<li>" + messages[i] + "</li>"
    }
    str += "</ul>"
    var alert = $("#" + id)
    var alertMessage = $("#" + id + " div")
    alertMessage.html("");
    alertMessage.html(str);
    if (statut == "default") {
        alert.removeClass("hidden alert-warning alert-danger alert-success")
        alert.addClass("hidden")
    } else if (statut == "success") {
        alert.removeClass("hidden alert-warning alert-danger alert-success")
        alert.addClass("alert-success")
    } else if (statut == "error") {
        alert.removeClass("hidden alert-warning alert-danger alert-success")
        alert.addClass("alert-danger")
    } else if (statut == "warning") {
        alert.removeClass("hidden alert-warning alert-danger alert-success")
        alert.addClass("alert-warning")

    } else if (statut == "nocolor") {
        alert.removeClass("hidden alert-warning alert-danger alert-success")
    }
}

exports.setStatusForm = setStatusForm
exports.setAlert = setAlert
exports.setStatusFormAll = setStatusFormAll
exports.countError = countError
exports.messagesAlert = messagesAlert
