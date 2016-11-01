window.onload = function() { // Attend que la page termine de charger

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

    function afficheTab(res) {
        $('#res').html('')
        var tab = "<table><tr><th>id</th><th>nom</th><th>email</th></tr>";
        for (client in res) {
            for (info in res[client]) {
                tab = "<td>" + res[client][info] + "</td>" + tab
            }
            tab = "<tr>" + tab
            tab += "</tr>"
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
        if (!validator.isEmail(formData.client_mail)) {
            afficherRes('Adresse email incorrecte')
        } else {

            $.ajax({
                url: 'http://localhost:3001/api/clients',
                type: 'POST',
                dataType: 'json', // On désire recevoir du JSON
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(formData),
                success: function(res, statut) {
                    if (res.status == 'success') {
                        afficherRes('Client ajouté. Identifiant : ' + res.id)
                    }
                },
                error: function(res, statut, erreur) {
                    afficherRes('Erreur : ' + getError(res).message)
                }
            })
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
                afficherRes('Erreur : ' + getError(res).message)
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









}
