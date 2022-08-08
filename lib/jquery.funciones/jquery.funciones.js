          /* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var pathService = "/VENTAS_SERVICIOS/webresources";
//var pathFarmaciaReportes = "https://farmacia-reportes.herokuapp.com";
var pathFarmaciaReportes = "http://localhost:8080/FARMACIA_REPORTES";
//var pathFarmaciaServicios = "https://farmacia-servicios.herokuapp.com";
var pathFarmaciaServicios = "http://henry-system:8080/FARMACIA_1_0_SERVICIOS-1.0-SNAPSHOT/rest";
var pathFarmacia = "http://henry-system:8080/FARMACIA_1_0_SERVICIOS-1.0-SNAPSHOT";

function dataPost(url, objeto, successCallback,async) {
                //show loading... image
                $.ajax({
                    type: "POST",
                    url: pathService + url,
                    async: async,
                    data: JSON.stringify(objeto),
                    contentType: 'application/json;',
                    dataType: 'json',
                    success: successCallback,
                    error: function(xhr, textStatus, errorThrown) {
                        console.log('error' + xhr +" "+ textStatus +" " + errorThrown);
                    }
                });
}

function dataGet(url,successCallback,async) {
                //show loading... image
                $.ajax({
                    type: "GET",
                    url: pathService + url,
                    async: async,                    
                    success: successCallback,
                    error: function(xhr, textStatus, errorThrown) {
                        console.log('error' + xhr +" "+ textStatus +" " + errorThrown);
                    }
                });
}


function validaFecha(fecha)
  {
    // regular expression to match required date format
    var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    console.log("entro validar fecha");
    if(fecha != undefined && fecha != '' && !fecha.match(re)) {
        console.log("fecha invalida");
      //alert("Invalid date format: " + fecha.value);
      //fecha.focus();
      return false;
    }

    // regular expression to match required time format
    //re = /^\d{1,2}:\d{2}([ap]m)?$/;

    /*if(form.starttime.value != '' && !form.starttime.value.match(re)) {
      alert("Invalid time format: " + form.starttime.value);
      form.starttime.focus();
      return false;
    }*/

    //alert("All input fields have been validated!");
    return true;
  }
function obtieneFechaActual(){
    var today = new Date();
    var dd = today.getDate();   
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    var hh = today.getHours(); //0-23
    var min = today.getMinutes();//0-59
    var ss = today.getSeconds();//0-59
    
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (hh < 10) {
        hh = '0' + hh;
    }
    if (min < 10) {
        min = '0' + min;
    }
    if (ss < 10) {
        ss = '0' + ss;
    }
    return dd + '/' + mm + '/' + yyyy +' '+hh +':'+min+':'+ss;
    
}
function formatoFecha(fecha){ //formato dd/mm/yyyy
    
    var dd = fecha.getDate();   
    var mm = fecha.getMonth()+1; //January is 0!
    var yyyy = fecha.getFullYear();
    
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }    
    return dd + '/' + mm + '/' + yyyy;
    
}


//funciones requeridas genericas
/*funcion que muestra la ventana modal*/
function mostrarVentanaModal(nombreModal){
    try {
        /*$('#'+nombreModal).each(function() {
            if($(this).parent().is('body')){
                console.log("el elemento tiene padre body");
                //$(this).remove();
                $('body').find(this).remove();
            }
        });*/
        //verificar si existe el elemento dentro del contenedor eliminar el que esta en el body
        /*var child = document.getElementById(nombreModal);
        
        if(child!==null){
            console.log(child);
            child.remove();
        }*/
        
        var tieneModal = 0;
        $('#panel-principal').children('div').each(function () {            //section.ng-scope
            console.log(this.id);
            if(this.id===nombreModal){
                tieneModal =1;                
            }
        });
        $('section.ng-scope').children('div').each(function () {            //section.ng-scope
            console.log(this.id);
            if(this.id===nombreModal){
                tieneModal =1;                
            }
        });
        console.log("tiene el modal en section o panel :" + tieneModal);
        $('body').children('div').each(function () {
            if(this.id===nombreModal && tieneModal ===1){ //si existe y existe en el contenedor borrar
                $('body').find(this).remove();
                console.log("entro borrar elemento...");
            }            
        });

        //console.log($('#'+nombreModal).html());
        //jQuery('#urDivId').parent().is('body')
        //$('body').find('#'+nombreModal).remove();
        //$('body').find("[id='"+nombreModal+"'][aria-hidden='true']").remove();
        //$('#body-container').remove('#'+nombreModal);
        $('#'+nombreModal).modal('show');
        $('#'+nombreModal).appendTo('body');
        $('body').removeClass();
    }catch(e){console.log(e);}
}

function agregarDivBody(nombreDiv){
    try {
        
        //verificar si existe el elemento dentro del contenedor eliminar el que esta en el body
        var tieneModal = 0;
        $('section.ng-scope').children('div').each(function () {            
            if(this.id===nombreDiv){
                tieneModal =1;                
            }
        });
        console.log(tieneModal);
        $('body').children('div').each(function () {
            if(this.id===nombreDiv && tieneModal ===1){ //si existe y existe en el contenedor borrar
                $('body').find(this).remove();
                console.log("entro borrar elemento...");
            }            
        });

        
        $('#'+nombreDiv).appendTo('body');
        $('body').removeClass();
    }catch(e){console.log(e);}
}

function ocultarVentanaModal(nombreModal){
    try {
        $(nombreModal).modal('hide');
        console.log("entro eliminar modal");
        //$('#body-container').remove(nombreModal);
        //$('#'+nombreModal).appendTo('body');


    } catch (e) {
        console.log(e);
    }
}

function startTimer () {
                timer.start();
                setTimeout(stopTimer,5000);
            }

            function stopTimer () {
                timer.stop;
            }


            function cargarContenido(codPersonal){
                $("#status").show();
                //startTimer();
                //stopTimer();
                $.ajax({url:pathFarmacia+"/ventana.jsp?codPersonal="+codPersonal+"&cod="+Math.random()+"",
                        success:function(result){
                                $("#cssmenu").html(result);
                                cargarTree();
                                $("#status").hide();
                        },                              
                        error: function (xhr, status) {  
                        $("#status").hide();
                        }
                    });
            }
            function cargarTree(){
            $('#cssmenu li.has-sub>a').on('click', function(){
		$(this).removeAttr('href');
		var element = $(this).parent('li');
                console.log(element);
		if (element.hasClass('open')) {
			element.removeClass('open');
			element.find('li').removeClass('open');
			element.find('ul').slideUp();
		}
		else {
			element.addClass('open');
			element.children('ul').slideDown();
			//element.siblings('li').children('ul').slideUp();
			element.siblings('li').removeClass('open');
			element.siblings('li').find('li').removeClass('open');
			//element.siblings('li').find('ul').slideUp();
		}
	});

	$('#cssmenu>ul>li.has-sub>a').append('<span class="holder"></span>');
            }
            
            
function obtenerSession(nombreObj){
    //return JSON.parse(sessionStorage.getItem(nombreObj));
    return JSON.parse(localStorage.getItem(nombreObj));
}
function guardarSession(nombreObj,Obj){
    //sessionStorage.setItem(nombreObj,  JSON.stringify(Obj));
    localStorage.setItem(nombreObj,  JSON.stringify(Obj));
    
    
}

function fechaActualDDMMYYYY(){ //formato dd/mm/yyyy
    var fecha = new Date();
    var dd = fecha.getDate();   
    var mm = fecha.getMonth()+1; //January is 0!
    var yyyy = fecha.getFullYear();
    
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }    
    return dd + '/' + mm + '/' + yyyy;    
}
function creaDate(fecha){//crea objeto date a partir de string fecha dd/MM/yyyy
    var date = new Date();
    
    
    date.setDate(parseInt(fecha.substring(0,2)));
    date.setMonth(parseInt(fecha.substring(3,5))-1);//enero es 0
    date.setFullYear(parseInt(fecha.substring(6,10)));
    return date;    
}
function redondeaDouble(monto){
    return Math.round(monto * 100) / 100;    
}