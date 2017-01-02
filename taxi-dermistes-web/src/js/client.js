'use strict'

var validation = require('./validation.js')
var gen = require('./general.js')
var alerts = require('./alerts.js')

$('#creer').on('submit', function(e) {
    e.preventDefault()
    var idForm = "creer"
    var formData = gen.formToJSON($(this))

    //ETAPE 1 : Vérifications côté client
    if (!validation.isEmpty(formData.client_name)) {
        alerts.setStatusForm('success', "client_name", idForm)

    } else {
        alerts.setStatusForm('error', "client_name", idForm)
        alerts.messagesAlert.push("Vous devez spécifier un nom")
        alerts.countError += 1
    }
    if (!validation.isValidEmail(formData.client_mail)) {
        alerts.countError += 1
        gen.afficherRes('Adresse email incorrecte')
        alerts.setStatusForm('error', "client_mail", idForm)
        alerts.messagesAlert.push("Adresse email incorrecte")
    } else {
        alerts.setStatusForm('success', "client_mail", idForm)
    }

    //ETAPE 2 : Envoi des données au serveur
    if (alerts.countError == 0) {
        $.ajax({
            url: 'http://localhost:3001/api/clients',
            type: 'POST',
            dataType: 'json', // On désire recevoir du JSON
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(formData),
            success: function(res, statut) {
                if (res.status == 'success') {
                    gen.afficherRes('Client ajouté. Identifiant : ' + res.id)
                    alerts.setStatusFormAll("success", idForm)
                    alerts.setAlert('success', ["Votre inscription a bien été enregistrée ! <i class='glyphicon glyphicon-ok-circle'></i>", "Votre identifiant est " + res.id], "creerClientAlert")
                }
            },
            error: function(res, statut, erreur) {
                gen.afficherRes('Erreur : ' + gen.gen.getError(res).message)
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

$('#chercher').on('submit', function(e) {
    e.preventDefault()
    var idForm = "chercher"
    var formData = gen.formToJSON($(this))

    if (validation.isValidId(formData.client_id)) {
        alerts.setStatusForm('success', "client_id", idForm)
    } else {
        alerts.setStatusForm('error', "client_id", idForm)
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
            url: 'http://localhost:3001/api/clients/' + formData.client_id,
            success: function(res) {
                console.log(res)
                alerts.setAlert('success', ["Identifiant : " + res.client_id, "Nom : " + res.client_name, "Email : " + res.client_mail], "chercherClientAlert")
            },
            error: function(res, statut, erreur) {
                alerts.setAlert('error', [gen.getError(res).message], "chercherClientAlert")
                gen.afficherRes('Erreur : ' + gen.getError(res).message)
            }
        })
    } else {
        alerts.setAlert('error', alerts.messagesAlert, "chercherClientAlert")
        alerts.countError = 0 //Réinitialisation des erreurs
        alerts.messagesAlert = [] //Réinitialisation des messages
    }
})

$('#lister').on('submit', function(e) {
    e.preventDefault()
    $.ajax({
        dataType: 'json',
        type: 'GET',
        url: 'http://localhost:3001/api/clients/',
        success: function(res) {
            alerts.setAlert('nocolor', [gen.creerTabClient(res)], "listerClientAlert")
            gen.afficheTab(res, "res", "clients")
        },
        error: function(res, statut, erreur) {
            alerts.setAlert('error', [gen.getError(res).message], "listerClientAlert")
                ('Erreur : ' + gen.getError(res).message)
        }
    })
})

$('#modifier').on('submit', function(e) {
    e.preventDefault()
    var idForm = "modifier"
    var formData = gen.formToJSON($(this))

    if (validation.isValidId(formData.client_id)) {
        alerts.setStatusForm('success', "client_id", idForm)
    } else {
        alerts.setStatusForm('error', "client_id", idForm)
        alerts.messagesAlert.push("L'identifiant ne doit contenir que des chiffres")
        alerts.countError += 1
    }
    if (!validation.isEmpty(formData.client_name)) {
        alerts.setStatusForm('success', "client_name", idForm)

    } else {
        alerts.setStatusForm('error', "client_name", idForm)
        alerts.messagesAlert.push("Vous devez spécifier un nom")
        alerts.countError += 1
    }
    if (!validation.isValidEmail(formData.client_mail)) {
        alerts.countError += 1
        gen.afficherRes('Adresse email incorrecte')
        alerts.setStatusForm('error', "client_mail", idForm)
        alerts.messagesAlert.push("Adresse email incorrecte")
    } else {
        alerts.setStatusForm('success', "client_mail", idForm)
    }

    if (alerts.countError == 0) {

        $.ajax({
            url: 'http://localhost:3001/api/clients',
            type: 'PUT',
            dataType: 'json', // On désire recevoir du JSON
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(formData),
            success: function(res, statut) {
                if (res.status == 'success') {
                    alerts.setAlert('success', ["Client modifié"], "modifierClientAlert")
                    gen.afficherRes('Client modifié')
                }
            },
            error: function(res, statut, erreur) {
                alerts.setAlert('error', [gen.getError(res).message], "modifierClientAlert")
                gen.afficherRes('Erreur : ' + gen.getError(res).message)
            }
        })
    } else {
        alerts.setAlert('error', alerts.messagesAlert, "modifierClientAlert")
        alerts.countError = 0 //Réinitialisation des erreurs
        alerts.messagesAlert = [] //Réinitialisation des messages
    }
})

$('#supprimer').on('submit', function(e) {
    e.preventDefault()
    var formData = gen.formToJSON($(this))
    var idForm = "supprimer"

    if (validation.isValidId(formData.client_id)) {
        alerts.setStatusForm('success', "client_id", idForm)
    } else {
        alerts.setStatusForm('error', "client_id", idForm)
        alerts.messagesAlert.push("L'identifiant ne doit contenir que des chiffres")
        alerts.countError += 1
    }

    if (alerts.countError == 0) {
        $.ajax({
            url: 'http://localhost:3001/api/clients',
            type: 'DELETE',
            dataType: 'json', // On désire recevoir du JSON
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(formData),
            success: function(res, statut) {
                if (res.status == 'success') {
                    gen.afficherRes('Client supprimé')
                    alerts.setAlert('success', ["Client supprimé"], "supprimerClientAlert")
                }
            },
            error: function(res, statut, erreur) {
                alerts.setAlert('error', [gen.getError(res).message], "supprimerClientAlert")
                gen.afficherRes('Erreur : ' + gen.getError(res).message)
            }
        })
    } else {
        alerts.setAlert('error', alerts.messagesAlert, "supprimerClientAlert")
        alerts.countError = 0 //Réinitialisation des erreurs
        alerts.messagesAlert = [] //Réinitialisation des messages
    }
})
