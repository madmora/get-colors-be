USE `bd_get_colors` ;

-- -----------------------------------------------------
--  CATALOGOS
-- -----------------------------------------------------

INSERT INTO tb_rol (rol, activo) VALUES
("Administrador", 1), 
("Usuario", 1);

-- -----------------------------------------------------
--  STORED PROCEDURE CREAR USUARIO
-- -----------------------------------------------------

DROP PROCEDURE IF EXISTS sp_crear_usuario;

DELIMITER //
CREATE PROCEDURE sp_crear_usuario(
    p_cedula    VARCHAR(20),
    p_email     VARCHAR(40),
    p_nombre    VARCHAR(20),
    p_apellidos VARCHAR(40),
    p_direccion VARCHAR(100),
    p_password  VARCHAR(150),
    p_rol       VARCHAR(20)
) 
BEGIN
    DECLARE v_rol_id INT;
    DECLARE v_seguridad_id INT;
    DECLARE v_responsable_id INT;
    DECLARE track_no INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN 
        GET DIAGNOSTICS CONDITION 1 @`errno` = MYSQL_ERRNO, @`sqlstate` = RETURNED_SQLSTATE, @`text` = MESSAGE_TEXT;
        SET @full_error = CONCAT( 'ERROR ', @`errno`, ' (', @`sqlstate`, '): ', @`text`);
        SELECT 1 AS "error", track_no, @full_error AS "errorMessage";

        ROLLBACK;
        SET AUTOCOMMIT = 1;
    END; 

    SELECT rol_id FROM tb_rol WHERE rol = p_rol INTO v_rol_id;

    SET AUTOCOMMIT = 0;
    START TRANSACTION;
    BEGIN
        INSERT INTO tb_seguridad(expiracion_password, expiracion_bloqueo, numero_intentos)
        VALUES (DATE_ADD(NOW(), INTERVAL 30 DAY), CURRENT_TIMESTAMP, 0);
        SET v_seguridad_id = LAST_INSERT_ID();
        SET track_no = 1;

        INSERT INTO tb_responsable(cedula, email, nombre, apellidos, direccion, password, fecha, activo, rol_id, seguridad_id)
        VALUES (p_cedula, p_email, p_nombre, p_apellidos, p_direccion, p_password, CURRENT_TIMESTAMP, 1, v_rol_id, v_seguridad_id);
        SET v_responsable_id = LAST_INSERT_ID();
        SET track_no = 2;

        INSERT INTO tb_historial_password(password, responsable_id)
        VALUES(p_password, v_responsable_id);
        SET track_no = 3;

        SELECT 0 AS "error", track_no;
    END;

    COMMIT;
    SET AUTOCOMMIT = 1;
END // 

DELIMITER ;

-- Password: Test2023**
CALL sp_crear_usuario("123456789", "test@test.com", "Nombre", "Apellidos", "Dirección", "$2a$10$/cP14Avg7h5dDZuhAPfKQu.ww57i7WVdTuYzzUlc2/eqSJ5RQrlka", "Administrador");


-- -----------------------------------------------------
--  STORED PROCEDURE OBTENER ESTADO CUENTA
-- -----------------------------------------------------

DROP PROCEDURE IF EXISTS sp_obtener_estado_cuenta;

DELIMITER //
CREATE PROCEDURE sp_obtener_estado_cuenta(
    p_responsable_id VARCHAR(40)
)
BEGIN
    SELECT res.activo AS "cuentaActiva", IF(ts.expiracion_password <= CURRENT_TIMESTAMP, 1, 0) AS "passwordExpirado", IF(ts.expiracion_bloqueo <= CURRENT_TIMESTAMP, 0, 1) AS "passwordBloqueado", IF(ts.numero_intentos >= 4, 1, 0) AS "intentosExcedido" FROM tb_responsable AS res
    INNER JOIN tb_seguridad AS ts ON ts.seguridad_id = res.seguridad_id
    WHERE res.cedula = p_responsable_id;
END //
DELIMITER ;

-- CALL sp_obtener_estado_cuenta("2222");

-- -----------------------------------------------------
--  STORED PROCEDURE AUMENTAR INTENTOS LOGIN
-- -----------------------------------------------------

DROP PROCEDURE IF EXISTS sp_aumentar_intentos_login;

DELIMITER //
CREATE PROCEDURE sp_aumentar_intentos_login(
    p_responsable   VARCHAR(20)
)
BEGIN
    DECLARE track_no INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 @`errno` = MYSQL_ERRNO, @`sqlstate` = RETURNED_SQLSTATE, @`text` = MESSAGE_TEXT;
        SET @full_error = CONCAT('ERROR ', @`errno`, ' (', @`sqlstate`, '): ', @`text`);
        SELECT 1 AS "error", track_no, @full_error AS "errorMessage";
    END;

    UPDATE tb_seguridad AS ts 
    INNER JOIN tb_responsable AS res ON res.seguridad_id = ts.seguridad_id
    SET ts.numero_intentos = (ts.numero_intentos + 1) 
    WHERE res.cedula = p_responsable;
    SET track_no = 1;
    
    SELECT 0 AS "error", track_no;
END //
DELIMITER ;

-- CALL sp_aumentar_intentos_login("2222");

-- -----------------------------------------------------
--  STORED PROCEDURE BLOQUEAR CUENTA
-- -----------------------------------------------------

DROP PROCEDURE IF EXISTS sp_bloquear_cuenta;

DELIMITER //
CREATE PROCEDURE sp_bloquear_cuenta(
    p_responsable   VARCHAR(20)
)
BEGIN
    DECLARE track_no INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 @`errno` = MYSQL_ERRNO, @`sqlstate` = RETURNED_SQLSTATE, @`text` = MESSAGE_TEXT;
        SET @full_error = CONCAT('ERROR ', @`errno`, ' (', @`sqlstate`, '): ', @`text`);
        SELECT 1 AS "error", track_no, @full_error AS "errorMessage";
    END;

    UPDATE tb_seguridad AS ts 
    INNER JOIN tb_responsable AS res ON res.seguridad_id = ts.seguridad_id
    SET ts.numero_intentos = 0, ts.expiracion_bloqueo =  DATE_ADD(NOW(), INTERVAL 30 MINUTE)
    WHERE res.cedula = p_responsable;
    SET track_no = 1;
    
    SELECT 0 AS "error", track_no;
END //
DELIMITER ;

-- CALL sp_bloquear_cuenta("2222");


-- -----------------------------------------------------
--  STORED PROCEDURE OBTENER HISTORIAL PASSWORD
-- -----------------------------------------------------

DROP PROCEDURE IF EXISTS sp_obtener_historial_password;

DELIMITER //
CREATE PROCEDURE sp_obtener_historial_password(
     p_responsable_id VARCHAR(20)
)
BEGIN
    SELECT hp.password FROM tb_responsable AS res
    INNER JOIN tb_historial_password AS hp ON hp.responsable_id = res.responsable_id
    WHERE res.cedula = p_responsable_id
    ORDER BY hp.historial_password_id ASC LIMIT 24;
END //
DELIMITER ;

-- CALL sp_obtener_historial_password("1234");

-- -----------------------------------------------------
--  STORED PROCEDURE LOGIN
-- -----------------------------------------------------

DROP PROCEDURE IF EXISTS sp_login;

DELIMITER //
CREATE PROCEDURE sp_login(
    p_responsable_id VARCHAR(40)
)
BEGIN
    SELECT res.password, res.cedula, res.email, res.nombre, res.apellidos, res.direccion, ro.rol FROM tb_responsable AS res
    INNER JOIN tb_rol AS ro ON ro.rol_id = res.rol_id
    WHERE res.activo = 1 AND (res.cedula = p_responsable_id OR res.email = p_responsable_id) ;
END //
DELIMITER ;

-- CALL sp_login("114130273");
-- CALL sp_login("bryanalfarop@gmail.com");

-- -----------------------------------------------------
--  STORED PROCEDURE OBTENER RESPONSABLE
-- -----------------------------------------------------

DROP PROCEDURE IF EXISTS sp_obtener_responsable;

DELIMITER //
CREATE PROCEDURE sp_obtener_responsable(
    p_responsable_id VARCHAR(40)
)
BEGIN
    SELECT res.cedula, res.email, res.nombre, res.apellidos, res.direccion, ro.rol FROM tb_responsable AS res
    INNER JOIN tb_rol AS ro ON ro.rol_id = res.rol_id
    WHERE res.activo = 1 AND (res.cedula = p_responsable_id OR res.email = p_responsable_id) ;
END //
DELIMITER ;

-- CALL sp_obtener_responsable("114130273");
-- CALL sp_obtener_responsable("bryanalfarop@gmail.com");


-- -----------------------------------------------------
--  STORED PROCEDURE ELIMINAR USUARIO
-- -----------------------------------------------------

DROP PROCEDURE IF EXISTS sp_eliminar_usuario;

DELIMITER //
CREATE PROCEDURE sp_eliminar_usuario(
    p_responsable   VARCHAR(20),
    p_cedula        VARCHAR(20)
)
BEGIN
    DECLARE v_responsable_id INT;
    DECLARE track_no INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 @`errno` = MYSQL_ERRNO, @`sqlstate` = RETURNED_SQLSTATE, @`text` = MESSAGE_TEXT;
        SET @full_error = CONCAT('ERROR ', @`errno`, ' (', @`sqlstate`, '): ', @`text`);
        SELECT 1 AS "error", track_no, @full_error AS "errorMessage";
    END;

    -- TODO: Add more fields to tb_responsable to add who did the updated of the table
    SELECT responsable_id FROM tb_responsable WHERE cedula = p_responsable INTO v_responsable_id;
    SET track_no = 1;

    UPDATE tb_responsable SET activo = 0 WHERE cedula = p_cedula;
    SET track_no = 2;
    
    SELECT 0 AS "error", track_no;
END //
DELIMITER ;

-- CALL sp_eliminar_usuario("123456789", "123456789");

-- -----------------------------------------------------
--  STORED PROCEDURE ACTIVAR USUARIO
-- -----------------------------------------------------

DROP PROCEDURE IF EXISTS sp_activar_usuario;

DELIMITER //
CREATE PROCEDURE sp_activar_usuario(
    p_responsable   VARCHAR(20),
    p_cedula        VARCHAR(20)
)
BEGIN
    DECLARE v_responsable_id INT;
    DECLARE track_no INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 @`errno` = MYSQL_ERRNO, @`sqlstate` = RETURNED_SQLSTATE, @`text` = MESSAGE_TEXT;
        SET @full_error = CONCAT('ERROR ', @`errno`, ' (', @`sqlstate`, '): ', @`text`);
        SELECT 1 AS "error", track_no, @full_error AS "errorMessage";
    END;

    -- TODO: Add more fields to tb_responsable to add who did the updated of the table
    SELECT responsable_id FROM tb_responsable WHERE cedula = p_responsable INTO v_responsable_id;
    SET track_no = 1;

    UPDATE tb_responsable SET activo = 1 WHERE cedula = p_cedula;
    SET track_no = 2;
    
    SELECT 0 AS "error", track_no;
END //
DELIMITER ;

-- CALL sp_activar_usuario("123456789", "123456789");

-- -----------------------------------------------------
--  STORED PROCEDURE ACTUALIZAR PASSWORD
-- -----------------------------------------------------

DROP PROCEDURE IF EXISTS sp_actualizar_password;

DELIMITER //
CREATE PROCEDURE sp_actualizar_password(
    p_responsable   VARCHAR(20),
    p_password      VARCHAR(150)
) 
BEGIN
    DECLARE v_seguridad_id INT;
    DECLARE v_responsable_id INT;
    DECLARE track_no INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN 
        GET DIAGNOSTICS CONDITION 1 @`errno` = MYSQL_ERRNO, @`sqlstate` = RETURNED_SQLSTATE, @`text` = MESSAGE_TEXT;
        SET @full_error = CONCAT( 'ERROR ', @`errno`, ' (', @`sqlstate`, '): ', @`text`);
        SELECT 1 AS "error", track_no, @full_error AS "errorMessage";

        ROLLBACK;
        SET AUTOCOMMIT = 1;
    END; 

    SELECT seguridad_id FROM tb_responsable WHERE cedula = p_responsable INTO v_seguridad_id;
    SELECT responsable_id FROM tb_responsable WHERE cedula = p_responsable INTO v_responsable_id;

    SET AUTOCOMMIT = 0;
    START TRANSACTION;
    BEGIN
        UPDATE tb_seguridad SET expiracion_password = DATE_ADD(NOW(), INTERVAL 30 DAY), expiracion_bloqueo = CURRENT_TIMESTAMP, numero_intentos = 0 
        WHERE seguridad_id = v_seguridad_id;
        SET track_no = 1;

        UPDATE tb_responsable SET password = p_password WHERE cedula = p_responsable;
        SET track_no = 2;

        INSERT INTO tb_historial_password(password, responsable_id)
        VALUES(p_password, v_responsable_id);
        SET track_no = 3;

        SELECT 0 AS "error", track_no;
    END;

    COMMIT;
    SET AUTOCOMMIT = 1;
END // 

DELIMITER ;

-- CALL sp_actualizar_password("1234", "laksdjfaklsdj");

-- -----------------------------------------------------
--  STORED PROCEDURE EDITAR USUARIO
-- -----------------------------------------------------

DROP PROCEDURE IF EXISTS sp_editar_usuario;

DELIMITER //
CREATE PROCEDURE sp_editar_usuario(
    p_cedula_actual VARCHAR(20),
    p_cedula        VARCHAR(20),
    p_email         VARCHAR(40),
    p_nombre        VARCHAR(20),
    p_apellidos     VARCHAR(40),
    p_direccion     VARCHAR(100),
    p_rol           VARCHAR(20),
    p_responsable   VARCHAR(20)
)
BEGIN
    DECLARE v_rol_id INT;
    DECLARE v_responsable_id INT;
    DECLARE track_no INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 @`errno` = MYSQL_ERRNO, @`sqlstate` = RETURNED_SQLSTATE, @`text` = MESSAGE_TEXT;
        SET @full_error = CONCAT('ERROR ', @`errno`, ' (', @`sqlstate`, '): ', @`text`);
        SELECT 1 AS "error", track_no, @full_error AS "errorMessage";
    END;

    -- TODO: Add more fields to tb_responsable to add who did the updated of the table
    SELECT responsable_id FROM tb_responsable WHERE cedula = p_responsable INTO v_responsable_id;
    SET track_no = 1;

    SELECT rol_id FROM tb_rol WHERE rol = p_rol INTO v_rol_id;
    SET track_no = 2;

    UPDATE tb_responsable SET cedula = p_cedula, email = p_email, nombre = p_nombre, apellidos = p_apellidos, direccion = p_direccion, rol_id = v_rol_id WHERE cedula = p_cedula_actual;
    SET track_no = 3;
    
    SELECT 0 AS "error", track_no;
END //
DELIMITER ;

-- CALL sp_editar_usuario("1234", "1234", "test@test.com", "Diego", "Lopez Garcia", "Nueva direccion", "administrador", "123456789");

-- -----------------------------------------------------
--  STORED PROCEDURE OBTENER USUARIOS
-- -----------------------------------------------------

DROP PROCEDURE IF EXISTS sp_obtener_usuarios;

DELIMITER //
CREATE PROCEDURE sp_obtener_usuarios()
BEGIN
    SELECT res.activo, res.cedula, res.email, res.nombre, res.apellidos, res.direccion, ro.rol FROM tb_responsable AS res
    INNER JOIN tb_rol AS ro ON ro.rol_id = res.rol_id;
END //
DELIMITER ;

-- CALL sp_obtener_usuarios();


-- -----------------------------------------------------
--  STORED PROCEDURE SOLICITUD RECUPERAR PASSWORD
-- -----------------------------------------------------

DROP PROCEDURE IF EXISTS sp_guardar_recuperar_password;

DELIMITER //
CREATE PROCEDURE sp_guardar_recuperar_password(
    p_email     VARCHAR(40),
    p_token     VARCHAR(150)
) 
BEGIN
    DECLARE v_responsable_id INT;
    DECLARE track_no INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN 
        GET DIAGNOSTICS CONDITION 1 @`errno` = MYSQL_ERRNO, @`sqlstate` = RETURNED_SQLSTATE, @`text` = MESSAGE_TEXT;
        SET @full_error = CONCAT( 'ERROR ', @`errno`, ' (', @`sqlstate`, '): ', @`text`);
        SELECT 1 AS "error", track_no, @full_error AS "errorMessage";

        ROLLBACK;
        SET AUTOCOMMIT = 1;
    END; 

    SELECT responsable_id FROM tb_responsable WHERE email = p_email INTO v_responsable_id;

    SET AUTOCOMMIT = 0;
    START TRANSACTION;
    BEGIN
        INSERT INTO tb_recuperar_password(email, token, expiracion, activo, responsable_id)
        VALUES (p_email, p_token, DATE_ADD(NOW(), INTERVAL 1 HOUR), 1, v_responsable_id);
        SET track_no = 1;

        SELECT 0 AS "error", track_no;
    END;

    COMMIT;
    SET AUTOCOMMIT = 1;
END // 

DELIMITER ;

-- CALL sp_guardar_recuperar_password("bryanalfarop@gmail.com","token1");

-- -----------------------------------------------------
--  STORED PROCEDURE OBTENER RECUPERAR PASSWORD
-- -----------------------------------------------------

DROP PROCEDURE IF EXISTS sp_obtener_recuperar_password;

DELIMITER //
CREATE PROCEDURE sp_obtener_recuperar_password(
    p_token VARCHAR(150)
)
BEGIN
    SELECT 
        res.cedula AS "responsable",  
        IF(rpa.expiracion <= CURRENT_TIMESTAMP or rpa.activo = 0, 1, 0) AS "tokenExpirado" 
        FROM tb_recuperar_password AS rpa
    INNER JOIN tb_responsable AS res ON res.responsable_id = rpa.responsable_id
    WHERE rpa.token = p_token;
END //
DELIMITER ;

-- CALL sp_obtener_recuperar_password("accafa39-3529-4cf6-88c4-616e92018740");



-- -----------------------------------------------------
--  STORED PROCEDURE ACTUALIZAR PASSWORD
-- -----------------------------------------------------

DROP PROCEDURE IF EXISTS sp_recuperar_password;

DELIMITER //
CREATE PROCEDURE sp_recuperar_password(
    p_responsable   VARCHAR(20),
    p_password      VARCHAR(150)
) 
BEGIN
    DECLARE v_seguridad_id INT;
    DECLARE v_responsable_id INT;
    DECLARE track_no INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN 
        GET DIAGNOSTICS CONDITION 1 @`errno` = MYSQL_ERRNO, @`sqlstate` = RETURNED_SQLSTATE, @`text` = MESSAGE_TEXT;
        SET @full_error = CONCAT( 'ERROR ', @`errno`, ' (', @`sqlstate`, '): ', @`text`);
        SELECT 1 AS "error", track_no, @full_error AS "errorMessage";

        ROLLBACK;
        SET AUTOCOMMIT = 1;
    END; 

    SELECT seguridad_id FROM tb_responsable WHERE cedula = p_responsable INTO v_seguridad_id;
    SELECT responsable_id FROM tb_responsable WHERE cedula = p_responsable INTO v_responsable_id;

    SET AUTOCOMMIT = 0;
    START TRANSACTION;
    BEGIN
        UPDATE tb_seguridad SET expiracion_password = DATE_ADD(NOW(), INTERVAL 30 DAY), expiracion_bloqueo = CURRENT_TIMESTAMP, numero_intentos = 0 
        WHERE seguridad_id = v_seguridad_id;
        SET track_no = 1;

        UPDATE tb_responsable SET password = p_password WHERE cedula = p_responsable;
        SET track_no = 2;

        INSERT INTO tb_historial_password(password, responsable_id)
        VALUES(p_password, v_responsable_id);
        SET track_no = 3;

        UPDATE tb_recuperar_password SET activo = 0
        WHERE responsable_id = v_responsable_id;
        SET track_no = 4;

        SELECT 0 AS "error", track_no;
    END;

    COMMIT;
    SET AUTOCOMMIT = 1;
END // 

DELIMITER ;

-- CALL sp_recuperar_password("1234", "laksdjfaklsdj");


