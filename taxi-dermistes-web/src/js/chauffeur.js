'use strict'

var validation = require('taxi-dermistes-common').validation
var gen = require('./general.js')
var alerts = require('./alerts.js')
var courses = require('./course.js')


$('#chercherChauffeur').on('submit', function(e) {
    e.preventDefault()
    var idForm = "chercherChauffeur"
    var formData = gen.formToJSON($(this))

    if (validation.isValidId(formData.chauffeur_id)) {
        alerts.setStatusForm('success', "chauffeur_id", idForm)
    } else {
        alerts.setStatusForm('error', "chauffeur_id", idForm)
        alerts.messagesAlert.push("L'identifiant ne doit contenir que des chiffres")
        alerts.countError += 1
    }

    //$.getJSON("http://localhost:3000/clients", req, function(data) {
    //    $("#res").text(JSON.stringify(data));
    //});
    if (alerts.countError == 0) {
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: route.route+'chauffeurs/' + formData.chauffeur_id,
            success: function(res) {
                console.log(res)
                alerts.setAlert('success', [], "chercherChauffeurAlert")
            },
            error: function(res, statut, erreur) {
                alerts.setAlert('error', [gen.getError(res).message], "chercherChauffeurAlert")
                gen.afficherRes('Erreur : ' + gen.getError(res).message)
            }
        })
    } else {
        alerts.setAlert('error', alerts.messagesAlert, "chercherChauffeurAlert")
        alerts.countError = 0 //Réinitialisation des erreurs
        alerts.messagesAlert = [] //Réinitialisation des messages
    }
})

$('#chercherCoursesChauffeur').on('submit', function(e) {
    e.preventDefault()
    var idForm = "chercherCoursesChauffeur"
    var formData = gen.formToJSON($(this))

    if (validation.isValidId(formData.chauffeur_id)) {
        alerts.setStatusForm('success', "chauffeur_id", idForm)
    } else {
        alerts.setStatusForm('error', "chauffeur_id", idForm)
        alerts.messagesAlert.push("L'identifiant ne doit contenir que des chiffres")
        alerts.countError += 1
    }

    //$.getJSON("http://localhost:3000/clients", req, function(data) {
    //    $("#res").text(JSON.stringify(data));
    //});
    if (alerts.countError == 0) {

        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: route.route+'chauffeurs/' + formData.chauffeur_id + "/courses",
            success: function(res) {
                console.log(res)
                $("#listeCoursesChauffeur").removeClass("hidden")
                gen.afficheTab(res, "listeCoursesChauffeur div", "courses")
                alerts.setAlert('default', "", "chercherChauffeurAlert")
            },
            error: function(res, statut, erreur) {
                alerts.setAlert('error', [gen.getError(res).message], "chercherChauffeurAlert")
                gen.afficherRes('Erreur : ' + gen.getError(res).message)
                $("#listeCoursesChauffeur").addClass("hidden")
            }
        })

        courses.afficheCoursesLibres(formData.chauffeur_id, "listeCoursesLibres div")
        $("#listeCoursesLibres").removeClass("hidden")

    } else {
        $("#coursesChauffeur").addClass("hidden")
        alerts.setAlert('error', alerts.messagesAlert, "chercherChauffeurAlert")
        alerts.countError = 0 //Réinitialisation des erreurs
        alerts.messagesAlert = [] //Réinitialisation des messages
    }
})

$('#creerC').on('submit', function(e) {
    e.preventDefault()
    var idForm = "creer"
    var formData = gen.formToJSON($(this))

    //ETAPE 1 : Vérifications côté client
    if (!validation.isEmpty(formData.chauffeur_name)) {
        alerts.setStatusForm('success', "chauffeur_name", idForm)

    } else {
        alerts.setStatusForm('error', "chauffeur_name", idForm)
        alerts.messagesAlert.push("Vous devez spécifier un nom")
        alerts.countError += 1
    }
    if (!validation.isValidEmail(formData.chauffeur_mail)) {
        alerts.countError += 1
        gen.afficherRes('Adresse email incorrecte')
        alerts.setStatusForm('error', "chauffeur_mail", idForm)
        alerts.messagesAlert.push("Adresse email incorrecte")
    } else {
        alerts.setStatusForm('success', "chauffeur_mail", idForm)
    }

    //ETAPE 2 : Envoi des données au serveur
    if (alerts.countError == 0) {
        $.ajax({
            url: route.route+'chauffeurs',
            type: 'POST',
            dataType: 'json', // On désire recevoir du JSON
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(formData),
            success: function(res, statut) {
                if (res.status == 'success') {
                    gen.afficherRes('Chauffeur ajouté. Identifiant : ' + res.id)
                    alerts.setStatusFormAll("success", idForm)
                    alerts.setAlert('success', ["Votre inscription a bien été enregistrée ! <i class='glyphicon glyphicon-ok-circle'></i>", "Votre identifiant est " + res.id],
                        "creerClientAlert")
                }
            },
            error: function(res, statut, erreur) {
                gen.afficherRes('Erreur : ' + gen.getError(res).message)
                alerts.setAlert('error', [gen.getError(res).message], "creerClientAlert")
            }
        })
    }

    //ETAPE 3 : Affichage des erreurs côté client
    else {
        alerts.setAlert('error', alerts.messagesAlert, "creerClientAlert")
        alerts.countError = 0 //Réinitialisation des erreurs
        alerts.messagesAlert = [] //Réinitialisation des messages
    }

})

$('#listerC').on('submit', function(e) {
    e.preventDefault()
    $.ajax({
        dataType: 'json',
        type: 'GET',
        url: route.route+'chauffeurs/',
        success: function(res) {
            alerts.setAlert('nocolor', [gen.creerTabChauffeur(res)], "listerClientAlert")
            gen.afficheTab(res, "res", "chauffeurs")
        },
        error: function(res, statut, erreur) {
            alerts.setAlert('error', [gen.getError(res).message], "listerClientAlert")
                ('Erreur : ' + gen.getError(res).message)
        }
    })
})
