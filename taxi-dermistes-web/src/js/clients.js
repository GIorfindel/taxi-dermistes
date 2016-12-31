window.onload = function() { // Attend que la page termine de charger

    function afficherRes(res) {
        $('#res').html('')
        $('#res').html(res)
    }

    function getError(res) {
        return JSON.parse(res.responseText)
    }

    function setStatusForm(statut, nomchamp) {
        var champForm = $("[name='" + nomchamp + "']")
        var divParent = champForm.parent()

        if (statut == "default") {
            divParent.removeClass("has-success has-error has-danger")
            divParent.find(".form-control-feedback").remove()
        } else if (statut == "success") {
            setStatusForm("default", nomchamp)
            divParent.addClass("has-success has-feedback")
            divParent.append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>')
        } else if (statut == "error") {
            setStatusForm("default", nomchamp)
            divParent.addClass("has-error has-feedback")
            divParent.append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>')
        } else if (statut == "warning") {
            setStatusForm("default", nomchamp)
            divParent.addClass("has-warning has-feedback")
            divParent.append('<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true"></span>')
        }

    }

    function setStatusFormAll(statut, idForm) {
        var form = formToJSON($("#" + idForm))
        for (var nomchamp in form) {
            setStatusForm(statut, nomchamp)
        }
    }

    function setMainAlert(statut, messages) {
        var str = "<ul>"
        for (var i = 0; i < messages.length; i++) {
            str += "<li>" + messages[i] + "</li>"
        }
        str += "</ul>"
        var mainAlert = $("#mainAlert")
        var mainAlertDiv = $("#mainAlert div")
        mainAlertDiv.html("");
        mainAlertDiv.html(str);
        if (statut == "default") {
            mainAlert.removeClass("hidden alert-warning alert-danger alert-success")
            mainAlert.addClass("hidden")
        } else if (statut == "success") {
            mainAlert.removeClass("hidden alert-warning alert-danger alert-success")
            mainAlert.addClass("alert-success")
        } else if (statut == "error") {
            mainAlert.removeClass("hidden alert-warning alert-danger alert-success")
            mainAlert.addClass("alert-danger")
        } else if (statut == "warning") {
            mainAlert.removeClass("hidden alert-warning alert-danger alert-success")
            mainAlert.addClass("alert-warning")
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

    function afficheTab(res) {
        $('#res').html('')
        var tab = "<table class='table table-hover'><tr><th>id</th><th>nom</th><th>email</th></tr>";
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
        var formData = formToJSON($(this))
        if (!validator.isEmpty(formData.client_name)) {
            if (!validator.isEmail(formData.client_mail)) {
                afficherRes('Adresse email incorrecte')
                setStatusForm('error', "client_mail")
                setMainAlert('error', ["Adresse email incorrecte"])
            } else {
                setStatusForm('success', "client_mail")
                $.ajax({
                    url: 'http://localhost:3001/api/clients',
                    type: 'POST',
                    dataType: 'json', // On désire recevoir du JSON
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(formData),
                    success: function(res, statut) {
                        if (res.status == 'success') {
                            afficherRes('Client ajouté. Identifiant : ' + res.id)
                            setStatusFormAll("success", "creer")
                            setMainAlert('success', ["Votre inscription a bien été enregistrée !"])
                        }
                    },
                    error: function(res, statut, erreur) {
                        afficherRes('Erreur : ' + getError(res).message)
                        setMainAlert('error', [getError(res).message])
                    }
                })
            }
        } else {
            setStatusForm('error', "client_name")
            setMainAlert('error', ["Vous devez spécifier un nom"])
        }
    })

    $('#chercher').on('submit', function(e) {
        e.preventDefault()
        var client_id = parseInt($('#chercher :input').val())
            //$.getJSON("http://localhost:3000/clients", req, function(data) {
            //    $("#res").text(JSON.stringify(data));
            //});
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: 'http://localhost:3001/api/clients/' + client_id,
            success: function(res) {
                console.log(res)
                afficherRes(formatageJSON(res))
            },
            error: function(res, statut, erreur) {
                afficherRes('Erreur : ' + getError(res).message)
            }
        })
    })

    $('#lister').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: 'http://localhost:3001/api/clients/',
            success: function(res) {
                afficheTab(res)
            },
            error: function(res, statut, erreur) {
                ('Erreur : ' + getError(res).message)
            }
        })
    })

    $('#modifier').on('submit', function(e) {
        e.preventDefault()

        var formData = formToJSON($(this))
        if (!validator.isEmpty(formData.client_mail) && !validator.isEmail(formData.client_mail)) {
            afficherRes('Adresse email incorrecte')
        } else {

            $.ajax({
                url: 'http://localhost:3001/api/clients',
                type: 'PUT',
                dataType: 'json', // On désire recevoir du JSON
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(formData),
                success: function(res, statut) {
                    if (res.status == 'success') {
                        afficherRes('Client modifié')
                    }
                },
                error: function(res, statut, erreur) {
                    afficherRes('Erreur : ' + getError(res).message)
                }
            })
        }
    })

    $('#supprimer').on('submit', function(e) {
        e.preventDefault()

        var formData = formToJSON($(this))
        $.ajax({
            url: 'http://localhost:3001/api/clients',
            type: 'DELETE',
            dataType: 'json', // On désire recevoir du JSON
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(formData),
            success: function(res, statut) {
                if (res.status == 'success') {
                    afficherRes('Client supprimé')
                }
            },
            error: function(res, statut, erreur) {
                afficherRes('Erreur : ' + getError(res).message)
            }
        })
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
              afficherRes('Course ajoutée pour l\'utilisateur : ' + res.id)
            }
          },
          error: function(res, statut, erreur) {
            afficherRes('Erreur : ' + getError(res).message)
          }
        })
    })






}
