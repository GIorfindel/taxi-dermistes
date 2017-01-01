'use strict'

var validation = require('./validation.js')
var gen = require('./general.js')
var alerts = require('./alerts.js')


$('#reserver').on('submit', function(e) {
    e.preventDefault()
    var formData = gen.formToJSON($(this))
    var idForm = "reserver"

    if (validation.isValidId(formData.client_id)) {
        alerts.setStatusForm('success', "client_id", idForm)
    } else {
        alerts.setStatusForm('error', "client_id", idForm)
        alerts.messagesAlert.push("L'identifiant ne doit contenir que des chiffres")
        alerts.countError += 1
    }
    if (!validation.isValidFutureDate(new Date(formData.course_date))) {
        alerts.setStatusForm('error', "course_date0", idForm)
        alerts.messagesAlert.push("La date n'est pas valide")
        alerts.countError += 1
    } else {
        alerts.setStatusForm('success', "course_date0", idForm)
    }
    if (!validation.isEmpty(formData.course_depart)) {
        alerts.setStatusForm('success', "course_depart", idForm)

    } else {
        alerts.setStatusForm('error', "course_depart", idForm)
        alerts.messagesAlert.push("Vous devez spécifier un lieu de départ")
        alerts.countError += 1
    }
    if (!validation.isEmpty(formData.course_arrivee)) {
        alerts.setStatusForm('success', "course_arrivee", idForm)

    } else {
        alerts.setStatusForm('error', "course_arrivee", idForm)
        alerts.messagesAlert.push("Vous devez spécifier un lieu d'arrivée")
        alerts.countError += 1
    }

    if (alerts.countError == 0) {
        $.ajax({
            url: 'http://localhost:3001/api/courses',
            type: 'POST',
            dataType: 'json', // On désire recevoir du JSON
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(formData),
            success: function(res, statut) {
                if (res.status == 'success') {
                    gen.afficherRes('Course ajoutée. Identifiant : ' + res.id)
                    alerts.setAlert('success', ["Course ajoutée. Identifiant : " + res.id], "reserverAlert")
                }
            },
            error: function(res, statut, erreur) {
                gen.afficherRes('Erreur : ' + gen.getError(res).message)
                alerts.setAlert('error', [gen.getError(res).message], "reserverAlert")
            }
        })
    } else {
        alerts.setAlert('error', alerts.messagesAlert, "reserverAlert")
        alerts.countError = 0 //Réinitialisation des erreurs
        alerts.messagesAlert = [] //Réinitialisation des messages
    }
})

$('#listerCourses').on('submit', function(e) {
    e.preventDefault()
    $.ajax({
        dataType: 'json',
        type: 'GET',
        url: 'http://localhost:3001/api/courses/',
        success: function(res) {
            alerts.setAlert('nocolor', [gen.creerTabCourses(res)], "listerClientAlert")
            gen.afficheTab(res, "res", "courses")
        },
        error: function(res, statut, erreur) {
            alerts.setAlert('error', [gen.getError(res).message], "listerClientAlert")
                ('Erreur : ' + gen.getError(res).message)
        }
    })
})
