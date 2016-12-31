window.onload = function() { // Attend que la page termine de charger

    var countError = 0
    var messagesAlert = []

    var uneDate = new Date(2016, 12, 20, 15, 50, 0);
    var uneDate2 = new Date(2016, 12, 20, 14, 50, 0);

    if (validator.isAfter(uneDate.toString(), uneDate2.toString())) {
        alert("après")
    } else {
        alert("avant/pendant")
    }


    function afficherRes(res) {
        $('#res').html('')
        $('#res').html(res)
    }

    function getError(res) {
        return JSON.parse(res.responseText)
    }

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
        var form = formToJSON($("#" + idForm))
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
        for (client in res) {
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

    function afficheTab(res) {
        $('#res').html('')
        var tab = creerTabClient
        $('#res').append(tab)
    }

    function isDefined(object) {
        return (typeof object !== 'undefined' || object)
    }

    function formatageJSON(objet) {
        var str = ""

        if (isDefined(objet.length)) {
            for (var i = 0; i < objet.length; i++) {
                str += "id : " + objet[i].client_id + ", nom : " + objet[i].client_name + ", email : " + objet[i].client_mail + "<br>";
            }
        } else {
            str += "id : " + objet.client_id + ", nom : " + objet.client_name + ", email : " + objet.client_mail + "<br>";
        }
        return str;
    }

    $('#creer').on('submit', function(e) {
        e.preventDefault()
        var idForm = "creer"
        var formData = formToJSON($(this))

        //ETAPE 1 : Vérifications côté client
        if (!validator.isEmpty(formData.client_name)) {
            setStatusForm('success', "client_name", idForm)

        } else {
            setStatusForm('error', "client_name", idForm)
            messagesAlert.push("Vous devez spécifier un nom")
            countError += 1
        }
        if (!validator.isEmail(formData.client_mail)) {
            countError += 1
            afficherRes('Adresse email incorrecte')
            setStatusForm('error', "client_mail", idForm)
            messagesAlert.push("Adresse email incorrecte")
        } else {
            setStatusForm('success', "client_mail", idForm)
        }

        //ETAPE 2 : Envoi des données au serveur
        if (countError == 0) {
            $.ajax({
                url: 'http://localhost:3001/api/clients',
                type: 'POST',
                dataType: 'json', // On désire recevoir du JSON
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(formData),
                success: function(res, statut) {
                    if (res.status == 'success') {
                        afficherRes('Client ajouté. Identifiant : ' + res.id)
                        setStatusFormAll("success", idForm)
                        setAlert('success', ["Votre inscription a bien été enregistrée ! <i class='glyphicon glyphicon-ok-circle'></i>", "Votre identifiant est " + res.id], "creerClientAlert")
                    }
                },
                error: function(res, statut, erreur) {
                    afficherRes('Erreur : ' + getError(res).message)
                    setAlert('error', [getError(res).message], "creerClientAlert")
                }
            })
        }

        //ETAPE 3 : Affichage des erreurs côté client
        else {
            setAlert('error', messagesAlert, "creerClientAlert")
            countError = 0 //Réinitialisation des erreurs
            messagesAlert = [] //Réinitialisation des messages
        }

    })

    $('#chercher').on('submit', function(e) {
        e.preventDefault()
        var idForm = "chercher"
        var formData = formToJSON($(this))

        if (validator.isNumeric(formData.client_id)) {
            setStatusForm('success', "client_id", idForm)
        } else {
            setStatusForm('error', "client_id", idForm)
            messagesAlert.push("L'identifiant ne doit contenir que des chiffres")
            countError += 1
        }

        //$.getJSON("http://localhost:3000/clients", req, function(data) {
        //    $("#res").text(JSON.stringify(data));
        //});
        if (countError == 0) {
            $.ajax({
                dataType: 'json',
                type: 'GET',
                url: 'http://localhost:3001/api/clients/' + formData.client_id,
                success: function(res) {
                    console.log(res)
                    afficherRes(formatageJSON(res))
                    setAlert('success', ["Identifiant : " + res.client_id, "Nom : " + res.client_name, "Email : " + res.client_mail], "chercherClientAlert")
                },
                error: function(res, statut, erreur) {
                    setAlert('error', [getError(res).message], "chercherClientAlert")
                    afficherRes('Erreur : ' + getError(res).message)
                }
            })
        } else {
            setAlert('error', messagesAlert, "chercherClientAlert")
            countError = 0 //Réinitialisation des erreurs
            messagesAlert = [] //Réinitialisation des messages
        }
    })

    $('#lister').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: 'http://localhost:3001/api/clients/',
            success: function(res) {
                setAlert('nocolor', [creerTabClient(res)], "listerClientAlert")
                afficheTab(res)
            },
            error: function(res, statut, erreur) {
                setAlert('error', [getError(res).message], "listerClientAlert")
                    ('Erreur : ' + getError(res).message)
            }
        })
    })

    $('#modifier').on('submit', function(e) {
        e.preventDefault()
        var idForm = "modifier"
        var formData = formToJSON($(this))

        if (validator.isNumeric(formData.client_id)) {
            setStatusForm('success', "client_id", idForm)
        } else {
            setStatusForm('error', "client_id", idForm)
            messagesAlert.push("L'identifiant ne doit contenir que des chiffres")
            countError += 1
        }
        if (!validator.isEmpty(formData.client_name)) {
            setStatusForm('success', "client_name", idForm)

        } else {
            setStatusForm('error', "client_name", idForm)
            messagesAlert.push("Vous devez spécifier un nom")
            countError += 1
        }
        if (!validator.isEmail(formData.client_mail)) {
            countError += 1
            afficherRes('Adresse email incorrecte')
            setStatusForm('error', "client_mail", idForm)
            messagesAlert.push("Adresse email incorrecte")
        } else {
            setStatusForm('success', "client_mail", idForm)
        }

        if (countError == 0) {

            $.ajax({
                url: 'http://localhost:3001/api/clients',
                type: 'PUT',
                dataType: 'json', // On désire recevoir du JSON
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(formData),
                success: function(res, statut) {
                    if (res.status == 'success') {
                        setAlert('success', ["Client modifié"], "modifierClientAlert")
                        afficherRes('Client modifié')
                    }
                },
                error: function(res, statut, erreur) {
                    setAlert('error', [getError(res).message], "modifierClientAlert")
                    afficherRes('Erreur : ' + getError(res).message)
                }
            })
        } else {
            setAlert('error', messagesAlert, "modifierClientAlert")
            countError = 0 //Réinitialisation des erreurs
            messagesAlert = [] //Réinitialisation des messages
        }
    })

    $('#supprimer').on('submit', function(e) {
        e.preventDefault()
        var formData = formToJSON($(this))
        var idForm = "supprimer"

        if (validator.isNumeric(formData.client_id)) {
            setStatusForm('success', "client_id", idForm)
        } else {
            setStatusForm('error', "client_id", idForm)
            messagesAlert.push("L'identifiant ne doit contenir que des chiffres")
            countError += 1
        }

        if (countError == 0) {
            $.ajax({
                url: 'http://localhost:3001/api/clients',
                type: 'DELETE',
                dataType: 'json', // On désire recevoir du JSON
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(formData),
                success: function(res, statut) {
                    if (res.status == 'success') {
                        afficherRes('Client supprimé')
                        setAlert('success', ["Client supprimé"], "supprimerClientAlert")
                    }
                },
                error: function(res, statut, erreur) {
                    setAlert('error', [getError(res).message], "supprimerClientAlert")
                    afficherRes('Erreur : ' + getError(res).message)
                }
            })
        } else {
            setAlert('error', messagesAlert, "supprimerClientAlert")
            countError = 0 //Réinitialisation des erreurs
            messagesAlert = [] //Réinitialisation des messages
        }
    })


    $('#reserver').on('submit', function(e) {
        e.preventDefault()
        var formData = formToJSON($(this))


        $.ajax({
            url: 'http://localhost:3001/api/courses',
            type: 'POST',
            dataType: 'json', // On désire recevoir du JSON
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(formData),
            success: function(res, statut) {
                if (res.status == 'success') {
                    afficherRes('Course ajoutée. Identifiant : ' + res.id)
                }
            },
            error: function(res, statut, erreur) {
                afficherRes('Erreur : ' + getError(res).message)
            }
        })
    })

    $('#chercherChauffeur').on('submit', function(e) {
        e.preventDefault()
        var idForm = "chercherChauffeur"
        var formData = formToJSON($(this))

        if (validator.isNumeric(formData.chauffeur_id)) {
            setStatusForm('success', "chauffeur_id", idForm)
        } else {
            setStatusForm('error', "chauffeur_id", idForm)
            messagesAlert.push("L'identifiant ne doit contenir que des chiffres")
            countError += 1
        }

        //$.getJSON("http://localhost:3000/clients", req, function(data) {
        //    $("#res").text(JSON.stringify(data));
        //});
        if (countError == 0) {
            $.ajax({
                dataType: 'json',
                type: 'GET',
                url: 'http://localhost:3001/api/chauffeurs/' + formData.chauffeur_id,
                success: function(res) {
                    console.log(res)
                    afficherRes(formatageJSON(res))
                    setAlert('success', [], "chercherClientAlert")
                },
                error: function(res, statut, erreur) {
                    setAlert('error', [getError(res).message], "chercherClientAlert")
                    afficherRes('Erreur : ' + getError(res).message)
                }
            })
        } else {
            setAlert('error', messagesAlert, "chercherClientAlert")
            countError = 0 //Réinitialisation des erreurs
            messagesAlert = [] //Réinitialisation des messages
        }
    })




}
