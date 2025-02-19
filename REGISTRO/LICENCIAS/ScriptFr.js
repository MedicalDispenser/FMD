$('#idHardwareDiv').hide();

$('#idNumeroSerieSoftwareDiv').hide();

$("#seeAnotherField").change(function() {

			if ($(this).val() == "maquina") {

				$('#idHardwareDiv').hide();

				$('#idNumeroSerieMaquinaDiv').show();

				$('#idNumeroSerieSoftwareDiv').hide();

			} else {

				$('#idHardwareDiv').show();

				$('#idNumeroSerieSoftwareDiv').show();	

				$('#idNumeroSerieMaquinaDiv').hide();		

			}

		});

		//$("#seeAnotherField").trigger("change");

$( "#form" ).submit(function( event ) {

		console.log("createRegistro - enter");

		var n = $('#nombre').val();

		var f = $('#nombreFarmacia').val();

		var d = $('#direccion').val();

		var cp = $('#cp').val();

		var t = $('#telefono').val();

		var e = $('#email').val();

		var nsm = $('#numeroSerieMaquina').val();

		var nss = $('#numeroSerieSoftware').val();

		var idh = $('#idHardware').val();

		var x = $('#idCheckBox').is(":checked");

		var msg_error = "";

		var error = false;

		var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

		var expr2 = /^\d{14}$/;



		if (n == "") {

			msg_error = 'Entrez un nom';

			error = true;

		}

		if (f == "") {

			msg_error = msg_error + '\nEntrez un nom de pharmacie';

			error = true;

		}

		if (d == "") {

			msg_error = msg_error + '\nEntrez votre adresse';

			error = true;

		}

		if (isNaN(t)) {

			msg_error = msg_error + '\nEntrer un numéro de téléphone';

			error = true;

		}

		if (isNaN(cp)) {

			msg_error = msg_error + '\nEntrez un CP valide';

			error = true;

		}

		if (!expr.test(e)) {

			msg_error = msg_error + '\nEntrez un e-mail correct';

			error = true;

		}

		if ($("#seeAnotherField").val() == "maquina") {

				if (!expr2.test(nsm)) {

					msg_error = msg_error + '\nEntrez un numéro de série correct';

					error = true;

				}

		}

		else {

				if (!expr2.test(nss)) {

					msg_error = msg_error + '\nEntrez un numéro de série correct';

					error = true;

				}	

				if (!expr2.test(idh)) {

					msg_error = msg_error + '\nEntrez un ID matériel correct';

					error = true;

				}

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

			console.log("createRegistro - register");

			console.log(f);

			var myHeaders = new Headers();

			myHeaders.append("Content-Type", "application/json");


			if ($("#seeAnotherField").val() == "maquina") {

				var raw = {

				  "registroOnline": {

				  	"Pais": "Francia",

				    "Nombre": n,

				    "NombreFarmacia": f,

				    "Direccion": d,

				    "CP": cp,

				    "Telefono": t,

				    "Email": e,

				    "tipo": "maquina",

				    "NumeroSerie": nsm

				  }

				};	

			} 

			else {

				var raw = {

				  "registroOnline": {

				  	"Pais": "Francia",

				    "Nombre": n,

				    "NombreFarmacia": f,

				    "Direccion": d,

				    "CP": cp,

				    "Telefono": t,

				    "Email": e,

				    "tipo": "software",

				    "NumeroSerie": nss,

				    "idHardware": idh

				  }

				};	

			}

			/*

			var requestOptions = {

			  method: 'POST',

			  headers: myHeaders,

			  body: raw,

			  redirect: 'follow',

			  mode: 'no-cors'

			};

			fetch("https://fmd3.eu-gb.mybluemix.net/v0/registroOnline", requestOptions)

			  .then(response => response.text())

			  .then(result => console.log(result))

			  .catch(error => console.log('error', error)); 

*/

				var codigo;
		$.ajax({

		    data: raw,

		    type: "POST",

		    dataType: "json",

		    async: false,

		    mode: 'cors',

  			credentials: 'include',

		    url: "https://fmd3.eu-gb.mybluemix.net/v0/registroOnline",
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
        		}
        }
		}); 
			if (codigo == 409) {
				const div = document.getElementById('modalText');
				const header = document.getElementById('modalHeader');
				div.textContent = 'L`inscription ne peut pas se faire plus de 3 fois';
				header.textContent = 'ERROR';
				event.preventDefault();
				$('#myModal').modal('show');
				//alert("El registro no puede realizarse más de 3 veces");
			}
			else if (codigo == 400) {
				const div = document.getElementById('modalText');
				const header = document.getElementById('modalHeader');
				div.textContent = 'Il y a eu une erreur dans le registre';
				header.textContent = 'ERROR';
				event.preventDefault();
				$('#myModal').modal('show');
				//alert("Ha habido un error en el registro");
			}
			else {
				const div = document.getElementById('modalText');
				const header = document.getElementById('modalHeader');
				div.textContent = 'l`inscription a été envoyée avec succès';
				header.textContent = 'INSCRIT';
				event.preventDefault();
				$('#myModal').modal('show');
				console.log("createRegistro - registered");
				//alert('El registro se ha enviado correctamente');
			}  

		}

});