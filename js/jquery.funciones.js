/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var pathService = "/VENTAS_SERVICIOS/webresources";
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



