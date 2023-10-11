export const spLogin = `CALL sp_login(?)`
export const spObtenerAcueducto = `CALL sp_obtener_acueducto(?)`
export const spObtenerExoneracion = `CALL sp_obtener_exoneracion(?)`
export const spObtenerPagoServicios = `CALL sp_obtener_pago_servicios(?)`
export const spObtenerTramites = `CALL sp_obtener_tramites(?)`
export const spObtenerDisponibilidadAgua = `CALL sp_obtener_disponibilidad_agua(?)`
export const spObtenerDisponibilidadAguaFraccionamiento = `CALL sp_obtener_disponibilidad_agua_fraccionamientos(?)`
export const spObtenerResponsable = `CALL sp_obtener_responsable(?)`
export const spGuardarExonera = `CALL sp_guardar_exonera(?,?,?,?,?,?,?,?,?)`
export const spGuardarQueja = `CALL sp_guardar_queja(?,?,?,?,?,?,?,?,?,?)`
export const spCrearUsuario = `CALL sp_crear_usuario(?,?,?,?,?,?,?)`
export const spEliminarUsuario = `CALL sp_eliminar_usuario(?,?)`
export const spActivarUsuario = `CALL sp_activar_usuario(?,?)`
export const spEditarUsuario = `CALL sp_editar_usuario(?,?,?,?,?,?,?,?)`
export const spObtenerUsuarios = `CALL sp_obtener_usuarios()`
export const spGuardarQuejaAmbiental = `CALL sp_guardar_queja_ambiental(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
export const spGuardarPagoBasura = `CALL sp_guardar_pago_basura(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
export const spGuardarTramiteInterno = `CALL sp_guardar_tramite_interno(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
export const spGuardarPagoServicio = `CALL sp_guardar_pago_servicio(?,?,?,?,?,?,?,?,?,?,?,?)`
export const spGuardarAgua300 = `CALL sp_guardar_agua_300(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
export const spGuardarAcueducto = `CALL sp_guardar_acueducto(?,?,?,?,?,?,?,?,?,?,?,?)`
export const spGuardarTramiteMunicipal = `CALL sp_guardar_tramite_municipal(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
export const spGuardarObrasMenoresMantenimiento = `CALL sp_guardar_obras_menores_mantenimiento(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
export const spGuardarBoletaTraspasoServicio = `CALL sp_guardar_boleta_traspaso_servicio(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
export const spGuardarVisadoPlanoCatastro = `CALL sp_guardar_visado_plano_catastro(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
export const spGuardarAguaFracUrba = `CALL sp_guardar_agua_frac_urba(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
export const spActualizarPassword = `CALL sp_actualizar_password(?,?)`
export const spRecuperarPassword = `CALL sp_recuperar_password(?,?)`
export const spObtenerHistorialPassword = `CALL sp_obtener_historial_password(?)`
export const spObtenerEstadoCuenta = `CALL sp_obtener_estado_cuenta(?)`
export const spAumentarIntentosLogin = `CALL sp_aumentar_intentos_login(?)`
export const spBloquearCuenta = `CALL sp_bloquear_cuenta(?)`
export const spGuardarRecuperarPassword = `CALL sp_guardar_recuperar_password(?,?)`
export const spObtenerRecuperarPassword = `CALL sp_obtener_recuperar_password(?)`
export const spObtenerQuejasAmbientales = `CALL sp_obtener_quejas_ambientales(?)`
export const spObtenerTiemposAtencion = `CALL sp_obtener_tiempos_atencion(?,?,?,?,?)`
export const spGuardarCategoriaSeguimiento = `CALL sp_guardar_categoria_seguimiento(?,?,?,?)`
export const spEditarCategoriaSeguimiento = `CALL sp_editar_categoria_seguimiento(?,?,?)`
export const spEliminarCategoriaSeguimiento = `CALL sp_eliminar_categoria_seguimiento(?)`
export const spActivarCategoriaSeguimiento = `CALL sp_activar_categoria_seguimiento(?)`
export const spObtenerCategoriaSeguimiento = `CALL sp_obtener_categorias_seguimiento()`
export const spObtenerCategoriaActivaSeguimiento = `CALL sp_obtener_categoria_activa_seguimiento()`
export const spGuardarSeguimiento = `CALL sp_guardar_seguimiento(?,?,?,?)`
export const spGuardarHistorialSeguimiento = `CALL sp_guardar_historial_seguimiento(?,?,?,?,?)`
export const spObtenerSeguimiento = `CALL sp_obtener_seguimiento(?,?,?)`
export const spObtenerDenunciasQuejas = `CALL sp_obtener_denuncias_quejas(?)`
export const spObtenerUsoSuelo = `CALL sp_obtener_uso_suelo(?)`
export const spGuardarUsoSuelo = `CALL sp_guardar_uso_suelo(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
export const spObtenerObrasMenoresMantenimiento = `call sp_obtener_obras_menores_o_mantenimiento(?)`
export const spObtenerVisadoMunicipalCatastro = `call sp_obtener_visado_municipal_de_planos_de_catastro(?)`
export const spObtenerBoletaTraspasoServicios = `call sp_obtener_boleta_traspaso_servicios(?)`
export const spObtenerHistorialSeguimiento = `call sp_obtener_historial_seguimiento(?)`
export const spActualizarNotificacionSeguimiento = `call sp_actualizar_notificacion_seguimiento(?,?)`
export const spGuardarDeclaracion = `call sp_guardar_declaracion(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
export const spGuardarDeclaracionBloque = `call sp_guardar_declaracion_bloque(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
export const spEditarDeclaracion = `call sp_editar_declaracion(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
export const spDeshabilitarDeclaracionBloque = `call sp_deshabilitar_declaracion_bloque(?)`
export const spObtenerDeclaracion = `call sp_obtener_declaracion(?)`
export const spObtenerDeclaracionBloque = `call sp_obtener_declaracion_bloque(?)`