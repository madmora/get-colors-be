-- ---------------------------------
-- COMMIT AND ROLLBACK TEMPLATE
-- ---------------------------------

DROP PROCEDURE IF EXISTS sp_transaction_template;

DELIMITER //

CREATE PROCEDURE sp_transaction_template(field1 INT, field2 DATE)
BEGIN
    DECLARE track_no INT DEFAULT 0;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 @`errno` = MYSQL_ERRNO, @`sqlstate` = RETURNED_SQLSTATE, @`text` = MESSAGE_TEXT;
        SET @full_error = CONCAT('ERROR ', @`errno`, ' (', @`sqlstate`, '): ', @`text`);
        SELECT 1 as "error", track_no, @full_error as "errorMessage";

        ROLLBACK;
        SET AUTOCOMMIT = 1;
    END;

    SET AUTOCOMMIT = 0;
    START TRANSACTION;
    BEGIN
        -- SENTENCE 1
        SET track_no = 1;

        -- SENTENCE 2
        SET track_no = 2;

        -- SENTENCE...

        SELECT 0 as "error", track_no;
    END;

    COMMIT;
    SET AUTOCOMMIT = 1;
END; //
DELIMITER ;


-- ---------------------------------
-- TRY CATCH TEMPLATE
-- ---------------------------------

DROP PROCEDURE IF EXISTS sp_try_catch_template;

DELIMITER //

CREATE PROCEDURE sp_try_catch_template(field1 INT, field2 DATE)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 @`errno` = MYSQL_ERRNO, @`sqlstate` = RETURNED_SQLSTATE, @`text` = MESSAGE_TEXT;
        SET @full_error = CONCAT('ERROR ', @`errno`, ' (', @`sqlstate`, '): ', @`text`);
        SELECT 1 as "error", @full_error as "errorMessage";
    END;

    -- SENTENCE
    SELECT 0 as "error";
END; //

DELIMITER ;