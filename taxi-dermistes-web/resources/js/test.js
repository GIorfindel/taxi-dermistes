window.onload = function() { // Attend que la page termine de charger

    function afficherRes(res) {
        $("#res").text();
        $("#res").text(res);
    }

    $('#creer').on("click", "button", function(e) {
        e.preventDefault();
        var email = $("input[name='client_email']").val();
        var name = $("input[name='client_name']").val();

        if (!validator.isEmail(email)) {
            afficherRes("Adresse email incorrecte");
        } else {

            $.ajax({
                url: 'http://localhost:8080/api/clients',
                type: 'POST',
                dataType: 'json', // On désire recevoir du JSON
                contentType: "application/json; charset=utf-8",
                data: '{"client_name":"' + name + '","client_mail":"' + email+'"}',
                success: function(res, statut) {
                    if(res.status == "success") {
                      afficherRes("Client ajouté");
                    }
                },
                error: function(resultat, statut, erreur) {
                      afficherRes("Erreur : "+ erreur);
                }
            });
        }
    });
    $('#chercher').on("click", "button", function(e) {
        var client_id = parseInt($("#chercher :input").val())
        e.preventDefault();
        //$.getJSON("http://localhost:3000/clients", req, function(data) {
        //    $("#res").text(JSON.stringify(data));
        //});
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: "http://localhost:8080/api/clients/"+client_id,
            success: function(response){$("#res").text(JSON.stringify(response))}
        });

    });
}
