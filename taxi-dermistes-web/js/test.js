window.onload = function () {

  function afficherErreur(erreur) {
    $("#res").text();
    $("#res").text(erreur);
  }

  $('form').on("click", "button", function(e) {
    e.preventDefault();
    var email = $("input[type='email']").val();
    if(!validator.isEmail(email)) {
      afficherErreur("Adresse email incorrecte");
    }
    else {
      
    }
  })
}
