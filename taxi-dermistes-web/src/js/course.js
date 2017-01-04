'use strict'

var validation = require('taxi-dermistes-common').validation
var gen = require('./general.js')
var alerts = require('./alerts.js')


function afficheCoursesLibres(chauffeur_id, divId) {
    $.ajax({
        dataType: 'json',
        type: 'GET',
        url: route.route + 'courses/',
        success: function(res) {
            res["chauffeur_id"] = chauffeur_id
            console.log(res)
            gen.afficheTab(res, divId, "coursesLibres")
        },
        error: function(res, statut, erreur) {
            alerts.setAlert('error', [gen.getError(res).message], "listerClientAlert")
                ('Erreur : ' + gen.getError(res).message)
        }
    })
}

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
            url: route.route + 'courses',
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
        url: route.route + 'courses/',
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

$('#listeCoursesLibres').on('click', "#modifierCoursesChauffeur button[type='submit']", function(e) {
    e.preventDefault()

    var button = $(this)[0]
    var formData
    var idForm = "modifierCoursesChauffeur"

    if (validation.isDefined(button)) {
        formData = gen.formToJSON($("#" + idForm))
        formData[button.name] = button.value
        console.log(formData)
    } else {
        alerts.messagesAlert.push("Erreur critique : valeur invalide")
        alerts.countError += 1
    }

    if (alerts.countError == 0) {
        console.log(formData)
        $.ajax({
            url: route.route + 'courses',
            type: 'PUT',
            dataType: 'json', // On désire recevoir du JSON
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(formData),
            success: function(res, statut) {
                if (res.status == 'success') {
                    console.log(res)
                    gen.afficherRes('Course modifiée.')
                    var action = ""
                    if (button.name == "accepter") {
                        action = "acceptée"
                    } else if (button.name == "refus") {
                        action = "refusée"
                    }
                    alerts.setAlert('success', ["Course " + button.value + " " + action + " !"], "mainAlert")
                    $("#chercherCoursesChauffeur").submit()
                }
            },
            error: function(res, statut, erreur) {
                console.log(res)
                gen.afficherRes('Erreur : ' + gen.getError(res).message)
                alerts.setAlert('error', [gen.getError(res).message], "mainAlert")
            }
        })
    } else {
        alerts.setAlert('error', alerts.messagesAlert, "mainAlert")
        alerts.countError = 0 //Réinitialisation des erreurs
        alerts.messagesAlert = [] //Réinitialisation des messages
    }

})

exports.afficheCoursesLibres = afficheCoursesLibres
