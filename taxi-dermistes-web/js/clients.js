window.onload = function() { // Attend que la page termine de charger

    function afficherRes(res) {
        $('#res').text('')
        $('#res').text(res)
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

    $('#creer').on('click', 'button', function(e) {
        e.preventDefault()

        var formData = formToJSON($('#creer'))

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
                        afficherRes('Client ajouté')
                    }
                },
                error: function(res, statut, erreur) {
                    afficherRes('Erreur : ' + getError(res).message)
                }
            })
        }
    })

    $('#chercher').on('click', 'button', function(e) {
        var client_id = parseInt($('#chercher :input').val())
        e.preventDefault()
        //$.getJSON("http://localhost:3000/clients", req, function(data) {
        //    $("#res").text(JSON.stringify(data));
        //});
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: 'http://localhost:3001/api/clients/' + client_id,
            success: function(res) {
            	$('#res').text(JSON.stringify(res))
            },
            error: function(res, statut, erreur) {
            	afficherRes('Erreur : ' + getError(res).message)
            }
        })

    })
}
