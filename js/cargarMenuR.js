/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//cargar menu para reportes (direccion de acuerdo a carpeta de reportes)
    $("#body-container").append( "<div canvas='container' id='canvas-principal'></div>" );//adiciona canvas a body-container
    $("#panel-principal").appendTo("#canvas-principal");//mueve el panel-principal dentro de canvas-principal
    $.get('../../menu.html', {}, function(data) {
            var $response = $('<div />').html(data);
            var $navCanvas = $response.find('#nav-canvas');
            var $menuLeft = $response.find('#menu-left');
            
            $('#body-container').append($navCanvas);
            $('#body-container').append($menuLeft);
            
            $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', '../../js/slideBar/slidebars.css') );
            $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', '../../js/slideBar/style.css') );
            
            $.getScript("../../js/slideBar/slidebars.js", function (data, textStatus, jqxhr) {
                //console.log(data); //data returned
                //console.log(textStatus); //success
                //console.log(jqxhr.status); //200
                //console.log('Load was performed.');
                $.getScript("../../js/slideBar/scripts.js");//llamar al script despues de tener el dom construido y haber cargado el slidebars
            });//llamar al script despues de tener el dom construido
            
            
            
            },'html');
    
    
    
    /*var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '../js/slideBar/slidebars.js';
    $("#body-container").append( script );
    
    var script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = '../js/slideBar/scripts.js';
    $("#body-container").append( script2 );*/
    
    