$( "#form" ).submit(function( event ) {

		console.log("createRegistro - enter");

		var f = $('#nombreFarmacia').val();

		var nif = $('#nifFarmacia').val();

		var t = $('#telefono').val();

		var e = $('#email').val();

		var x = $('#idCheckBox').is(":checked");

		var msg_error = "";

		var error = false;

		var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

		var expr2 = /^\d{14}$/;


		if (f == "") {

			msg_error = msg_error + '\nSaisir le nom d`une pharmacie';

			error = true;

		}

		if (nif == "") {

			msg_error = msg_error + '\nSaisir un FNI de pharmacie';

			error = true;

		}

		if (!expr.test(e)) {

			msg_error = msg_error + '\nSaisir une adresse électronique correcte';

			error = true;

		}


		if (!x) {

			msg_error = msg_error + '\nVous devez accepter les conditions d`utilisation';

			error = true;

		}



		if (error) { 
			const div = document.getElementById('modalText');
			const header = document.getElementById('modalHeader');
			div.textContent = msg_error;
			header.textContent = 'ERROR';
			event.preventDefault();
			$('#myModal').modal('show'); 
			//alert("Error al registrarse:\n"+ msg_error+ "error");

		}

		else {

			console.log("createRegistro - registerrrrr");

			console.log(f);

			var myHeaders = new Headers();

			myHeaders.append("accepts", "application/json");

			myHeaders.append("content-type", "application/json");

			var raw = {

				  "cinfaCode": "000000",
				  
				  "cif": nif,

				  "name": f,

				  "email": e
				};
		var codigo;
		$.ajax({

		    data: JSON.stringify(raw),

		    type: "POST",

		    dataType: "json",

		    async: false,

		    mode: 'cors',

		    contentType: 'application/json',

  		    credentials: 'include',

		    url: "https://medicaldispenser-sw.cinfa.com/sync/activate",
		    success: function (data, status, jqXHR) {
            console.log(jqXHR.status);
            codigo = 200;
        },
        error: function (jqXHR, status) {
        		console.log('Registro incorrecto');
        		if (jqXHR.status == 409) {
        			codigo = 409;
        			console.log(jqXHR.status);
        		}
        		else {
        			codigo = 400;
        			console.log(jqXHR.status);
				console.log(jqXHR.responseJSON.error);
				console.log('Hay un error');
        		}
        }
		}); 
			if (codigo == 409) {
				const div = document.getElementById('modalText');
				const header = document.getElementById('modalHeader');
				div.textContent = 'L`inscription ne peut se faire plus de 3 fois';
				header.textContent = 'ERROR';
				event.preventDefault();
				$('#myModal').modal('show');
				//alert("El registro no puede realizarse más de 3 veces");
			}
			else if (codigo == 400) {
				const div = document.getElementById('modalText');
				const header = document.getElementById('modalHeader');
				div.textContent = 'Une erreur s`est produite lors de l`enregistrement';
				header.textContent = 'ERROR';
				event.preventDefault();
				$('#myModal').modal('show');
				//alert("Ha habido un error en el registro");
			}
			else {
				const div = document.getElementById('modalText');
				const header = document.getElementById('modalHeader');
				div.textContent = 'L`enregistrement a été envoyé avec succès';
				header.textContent = 'ENREGISTRÉ';
				event.preventDefault();
				$('#myModal').modal('show');
				console.log("createRegistro - registered");
				//alert('El registro se ha enviado correctamente');
			}                     
			

		}

});