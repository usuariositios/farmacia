define([], function()
{
    var path = "/farmacia";
    return {
        defaultRoutePath: '/',
        routes: {
            '/empresas': {
                templateUrl: '/farmacia/empresa/navegadorEmpresas.html',
                dependencies: [
                    'controllers/navegadorEmpresasController'
                ]
            },
            '/productos': {
                templateUrl: '/farmacia/producto/navegadorProductos.html',
                dependencies: [
                    'controllers/navegadorProductosController'                    
                ]
            },
            '/gruposProducto': {
                templateUrl: '/farmacia/grupoProducto/navegadorGrupoProducto.html',
                dependencies: [
                    'controllers/navegadorGruposProductoController'
                ]
            },
            '/navegadorIngresosVenta': {
                templateUrl: '/farmacia/ingresosVenta/navegadorIngresosVenta.html',
                dependencies: [
                    'controllers/navegadorIngresosVentaController'
                ]
            },
            '/agregarIngresosVenta': {
                templateUrl: '/farmacia/ingresosVenta/agregarIngresosVenta.html',
                dependencies: [
                    'controllers/agregarIngresosVentaController'
                ]
            },
            '/editarIngresosVenta': {
                templateUrl: '/farmacia/ingresosVenta/editarIngresosVenta.html',
                dependencies: [
                    'controllers/editarIngresosVentaController'
                ]
            },
            '/navegadorSalidasVenta': {
                templateUrl: '/farmacia/salidasVenta/navegadorSalidasVenta.html',
                dependencies: [
                    'controllers/navegadorSalidasVentaController'
                ]
            },
            '/agregarSalidasVenta': {
                templateUrl: '/farmacia/salidasVenta/agregarSalidasVenta.html',
                dependencies: [
                    'controllers/agregarSalidasVentaController'
                ]
            },
            '/editarSalidasVenta': {
                templateUrl: '/farmacia/salidasVenta/editarSalidasVenta.html',
                dependencies: [
                    'controllers/editarSalidasVentaController'
                ]
            },
            '/reporteKardexMovimiento': {
                templateUrl: '/farmacia/reportes/reporteKardexMovimiento/reporteKardexMovimiento.html',
                dependencies: [
                    'controllers/reporteKardexMovimientoController'
                ]
            },
            '/reporteExistencias': {
                templateUrl: '/farmacia/reportes/reporteExistencias/reporteExistencias.html',
                dependencies: [
                    'controllers/reporteExistenciasController'
                ]
            },
            '/navegadorProveedores': {
                templateUrl: '/farmacia/proveedores/navegadorProveedores.html',
                dependencies: [
                    'controllers/navegadorProveedoresController'
                ]
            },
            '/navegadorSubGruposProducto': {
                templateUrl: '/farmacia/subGruposProducto/navegadorSubGruposProducto.html',
                dependencies: [
                    'controllers/navegadorSubGruposProductoController'
                ]
            },
            '/navegadorClientes': {
                templateUrl: '/farmacia/clientes/navegadorClientes.html',
                dependencies: [
                    'controllers/navegadorClientesController'
                ]
            },
            '/navegadorOrdenesCompra': {
                templateUrl: '/farmacia/ordenesCompra/navegadorOrdenesCompra.html',
                dependencies: [
                    'controllers/navegadorOrdenesCompraController'
                ]
            },
            '/agregarOrdenesCompra': {
                templateUrl: '/farmacia/ordenesCompra/agregarOrdenesCompra.html',
                dependencies: [
                    'controllers/agregarOrdenesCompraController'
                ]
            },
            '/editarOrdenesCompra': {
                templateUrl: '/farmacia/ordenesCompra/editarOrdenesCompra.html',
                dependencies: [
                    'controllers/editarOrdenesCompraController'
                ]
            },
            '/navegadorConfigFactura': {
                templateUrl: '/farmacia/configFactura/navegadorConfigFactura.html',
                dependencies: [
                    'controllers/navegadorConfigFacturaController'
                ]
            },
            '/navegadorFacturaDosificacion': {
                templateUrl: '/farmacia/facturaDosificacion/navegadorFacturaDosificacion.html',
                dependencies: [
                    'controllers/navegadorFacturaDosificacionController'
                ]
            },
            '/navegadorFacturasEmitidas': {
                templateUrl: '/farmacia/facturasEmitidas/navegadorFacturasEmitidas.html',
                dependencies: [
                    'controllers/navegadorFacturasEmitidasController'
                ]
            },
            '/navegadorSalidasVentaAmortizacion': {
                templateUrl: '/farmacia/salidasVentaAmortizacion/navegadorSalidasVentaAmortizacion.html',
                dependencies: [
                    'controllers/navegadorSalidasVentaAmortizacionController'
                ]
            },
            '/agregarSalidasVentaAmortizacion': {
                templateUrl: '/farmacia/salidasVentaAmortizacion/agregarSalidasVentaAmortizacion.html',
                dependencies: [
                    'controllers/agregarSalidasVentaAmortizacionController'
                ]
            },
            '/reporteLibroCompras': {
                templateUrl: '/farmacia/reportes/reporteLibroCompras/reporteLibroCompras.html',
                dependencies: [
                    'controllers/reporteLibroComprasController'
                ]
            },
            '/reporteLibroVentas': {
                templateUrl: '/farmacia/reportes/reporteLibroVentas/reporteLibroVentas.html',
                dependencies: [
                    'controllers/reporteLibroVentasController'
                ]
            },
            '/reporteVentasFacturadas': {
                templateUrl: '/farmacia/reportes/reporteVentasFacturadas/reporteVentasFacturadas.html',
                dependencies: [
                    'controllers/reporteVentasFacturadasController'
                ]
            },
            '/reporteVentasConsolidadoPorProducto': {
                templateUrl: '/farmacia/reportes/reporteVentasConsolidProd/reporteVentasConsolidProd.html',
                dependencies: [
                    'controllers/reporteVentasConsolidProdController'
                ]
            },
            '/reporteVentasConsolidadoPorGrupo': {
                templateUrl: '/farmacia/reportes/reporteVentasConsolidGrupo/reporteVentasConsolidGrupo.html',
                dependencies: [
                    'controllers/reporteVentasConsolidProdGrupoController'
                ]
            },
            '/reporteCuentasPorCobrarCliente': {
                templateUrl: '/farmacia/reportes/reporteCuentasPorCobrarCliente/reporteCuentasPorCobrarCliente.html',
                dependencies: [
                    'controllers/reporteCuentasPorCobrarClienteController'
                ]
            },
            '/reporteKardexMovimientoValorado': {
                templateUrl: '/farmacia/reportes/reporteKardexMovimientoValorado/reporteKardexMovimientoValorado.html',
                dependencies: [
                    'controllers/reporteKardexMovimientoValoradoController'
                ]
            },
            '/agregarIngresosVentaDevolucion': {
                templateUrl: '/farmacia/ingresosVentaDevolucion/agregarIngresosVentaDevolucion.html',
                dependencies: [
                    'controllers/agregarIngresosVentaDevolucionController'
                ]
            },
            '/navegadorIngresosVentaDevolucion': {
                templateUrl: '/farmacia/ingresosVentaDevolucion/navegadorIngresosVentaDevolucion.html',
                dependencies: [
                    'controllers/navegadorIngresosVentaDevolucionController'
                ]
            },
            '/agregarFactura': {
                templateUrl: '/farmacia/facturasEmitidas/agregarFactura.html',
                dependencies: [
                    'controllers/agregarFacturaController'
                ]
            },
            '/editarFactura': {
                templateUrl: '/farmacia/facturasEmitidas/editarFactura.html',
                dependencies: [
                    'controllers/editarFacturaController'
                ]
            },
            '/navegadorTablas': {
                templateUrl: '/farmacia/tablas/navegadorTablas.html',
                dependencies: [
                    'controllers/navegadorTablasController'
                ]
            },
            '/navegadorTablasDetalle': {
                templateUrl: '/farmacia/tablasDetalle/navegadorTablasDetalle.html',
                dependencies: [
                    'controllers/navegadorTablasDetalleController'
                ]
            },
            '/navegadorSucursalVentas': {
                templateUrl: '/farmacia/sucursalVentas/navegadorSucursalVentas.html',
                dependencies: [
                    'controllers/navegadorSucursalVentasController'
                ]
            },
            '/navegadorAlmacenesVenta': {
                templateUrl: '/farmacia/almacenesVenta/navegadorAlmacenesVenta.html',
                dependencies: [
                    'controllers/navegadorAlmacenesVentaController'
                ]
            },            
            '/reporteProductosVencidos': {
                templateUrl: '/farmacia/reportes/reporteProductosVencidos/reporteProductosVencidos.html',
                dependencies: [
                    'controllers/reporteProductosVencidosController'
                ]
            }            
        }
    };
});