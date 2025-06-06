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

			msg_error = msg_error + '\nIntroduzir o nome de uma farmácia';

			error = true;

		}

		if (nif == "") {

			msg_error = msg_error + '\nIntroduzir um NIF de farmácia';

			error = true;

		}

		if (!expr.test(e)) {

			msg_error = msg_error + '\nIntroduzir um endereço de correio eletrónico correto';

			error = true;

		}


		if (!x) {

			msg_error = msg_error + '\nO utilizador deve aceitar as condições de utilização';

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

				  "email": e,

				  "origin": "fagor_pt"
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
				div.textContent = 'O registo não pode ser efectuado mais de 3 vezes';
				header.textContent = 'ERROR';
				event.preventDefault();
				$('#myModal').modal('show');
				//alert("El registro no puede realizarse más de 3 veces");
			}
			else if (codigo == 400) {
				const div = document.getElementById('modalText');
				const header = document.getElementById('modalHeader');
				div.textContent = 'Ocorreu um erro no registo';
				header.textContent = 'ERROR';
				event.preventDefault();
				$('#myModal').modal('show');
				//alert("Ha habido un error en el registro");
			}
			else {
				const div = document.getElementById('modalText');
				const header = document.getElementById('modalHeader');
				div.textContent = 'O registo foi enviado com sucesso';
				header.textContent = 'REGISTADO';
				event.preventDefault();
				$('#myModal').modal('show');
				console.log("createRegistro - registered");
				//alert('El registro se ha enviado correctamente');
			}                     
			

		}

});