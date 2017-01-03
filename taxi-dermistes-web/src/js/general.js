'use strict'

var validation = require('./validation.js')

function afficherRes(res) {
    $('#res').html('')
    $('#res').html(res)
}

function getError(res) {
    return JSON.parse(res.responseText)
}

function formToJSON(form) {
    var unindexed_array = form.serializeArray()
    var indexed_array = {}

    $.map(unindexed_array, (n, i) => {
        indexed_array[n['name']] = n['value']
    })

    return indexed_array
}

function creerTabClient(res) {
    var tab = "<table class='table table-hover table-condensed table-bordered'><tr><th>id</th><th>nom</th><th>email</th></tr>";
    for (var client in res) {
        /*for (info in res[client]) {
            tab = "<td>" + res[client].info + "</td>" + tab
        }
        tab = "<tr>" + tab
        tab += "</tr>"*/
        tab += "<tr>";
        tab += "<td>" + res[client].client_id + "</td>"
        tab += "<td>" + res[client].client_name + "</td>"
        tab += "<td>" + res[client].client_mail + "</td>"
        tab += "</tr>";
    }
    tab += "</table>"
    return tab
}

function creerTabChauffeur(res) {
    var tab = "<table class='table table-hover table-condensed table-bordered'><tr><th>id</th><th>nom</th><th>email</th></tr>";
    for (var chauffeur in res) {
        /*for (info in res[client]) {
            tab = "<td>" + res[client].info + "</td>" + tab
        }
        tab = "<tr>" + tab
        tab += "</tr>"*/
        tab += "<tr>";
        tab += "<td>" + res[chauffeur].chauffeur_id + "</td>"
        tab += "<td>" + res[chauffeur].chauffeur_name + "</td>"
        tab += "<td>" + res[chauffeur].chauffeur_mail + "</td>"
        tab += "</tr>";
    }
    tab += "</table>"
    return tab
}

function creerTabCourses(res) {
    var tab = "<table class='table table-hover table-condensed table-bordered'><tr><th>id</th><th>client</th><th>date</th><th>départ</th><th>arrivée</th><th>chauffeur</th></tr>";
    for (var course in res) {
        /*for (info in res[client]) {
            tab = "<td>" + res[client].info + "</td>" + tab
        }
        tab = "<tr>" + tab
        tab += "</tr>"*/
        tab += "<tr>";
        tab += "<td>" + res[course].course_id + "</td>"
        tab += "<td>" + res[course].client_id + "</td>"
        tab += "<td>" + res[course].course_date + "</td>"
        tab += "<td>" + res[course].course_depart + "</td>"
        tab += "<td>" + res[course].course_arrivee + "</td>"
        tab += "<td>" + res[course].chauffeur_id + "</td>"
        tab += "</tr>";
    }
    tab += "</table>"
    return tab
}

function creerTabCoursesLibres(res) {
    var chauffeur_id = res["chauffeur_id"]
    var tab = "<form id='modifierCoursesChauffeur' method='post' action='' class='form-horizontal'>"
    tab += "<table class='table table-hover table-condensed table-bordered'><tr><th>id</th><th>client</th><th>date</th><th>départ</th><th>arrivée</th><th>Accepter</th><th>Refuser</th></tr>";
    for (var i = 0; i < res.length; i++) {
        if (!validation.isDefined(res[i].chauffeur_id) && !res[i].refus.includes(chauffeur_id)) {
            tab += "<tr>";
            tab += "<td>" + res[i].course_id + "</td>"
            tab += "<td>" + res[i].client_id + "</td>"
            tab += "<td>" + res[i].course_date + "</td>"
            tab += "<td>" + res[i].course_depart + "</td>"
            tab += "<td>" + res[i].course_arrivee + "</td>"
            tab += "<td><button class='btn btn-primary' type='submit' name='accepter' value='" + res[i].course_id + "'>Accepter</button></td>"
            tab += "<td><button class='btn btn-danger' type='submit' name='refus' value='" + res[i].course_id + "'>Refuser</button></td>"
            tab += "</tr>"
        }
    }
    tab += "<input type='hidden' name='chauffeur_id' value='"+ chauffeur_id +"'>"
    tab += "</table></form>"
    return tab
}

function afficheTab(res, idSelecteur, type) {
    var objet = $("#" + idSelecteur)
    console.log(idSelecteur)
    var tab
    objet.html("")
    if (type == "clients")
        tab = creerTabClient(res)
    else if (type == "chauffeurs")
        tab = creerTabChauffeur(res)
    else if (type == "courses")
        tab = creerTabCourses(res)
    else if (type == "coursesLibres")
        tab = creerTabCoursesLibres(res)
    objet.append(tab)
    objet.removeClass("hidden")
}

exports.formToJSON = formToJSON
exports.afficherRes = afficherRes
exports.afficheTab = afficheTab
exports.getError = getError
exports.creerTabCoursesLibres = creerTabCoursesLibres
exports.creerTabCourses = creerTabCourses
exports.creerTabClient = creerTabClient
exports.creerTabChauffeur = creerTabChauffeur
