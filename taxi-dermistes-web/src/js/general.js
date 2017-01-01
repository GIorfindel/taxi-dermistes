'use strict'

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
        tab += "<td>" + res[client].client_mail + "</td></tr>"
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
        tab += "<td>" + res[chauffeur].chauffeur_mail + "</td></tr>"
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
    }
    tab += "</table>"
    return tab
}

function creerTabCoursesLibres(res) {
    var tab = "<table class='table table-hover table-condensed table-bordered'><tr><th>id</th><th>client</th><th>date</th><th>départ</th><th>arrivée</th><th>Accepter</th><th>Refuser</th></tr>";
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
    }
    tab += "</table>"
    return tab
}

function afficheTab(res, idSelecteur, type) {
    var objet = $("#" + idSelecteur)
    var tab
    objet.html("")
    if (type == "clients")
        tab = creerTabClient(res)
    else if (type == "chauffeurs")
        tab = creerTabChauffeur(res)
    else if (type == "courses")
        tab = creerTabCourses(res)
    objet.append(tab)
}

exports.formToJSON = formToJSON
exports.afficherRes = afficherRes
exports.afficheTab = afficheTab
exports.getError = getError
exports.creerTabCoursesLibres = creerTabCoursesLibres
exports.creerTabCourses = creerTabCourses
exports.creerTabClient = creerTabClient
exports.creerTabChauffeur = creerTabChauffeur
