delimiter //

CREATE PROCEDURE sale(userIN text)

BEGIN
declare t_id int;
select max(transId) into t_id from dataGangstas.transArchive;

IF t_id is null then
set t_id = 1;
ELSE
set t_id = t_id + 1;
END IF;

INSERT INTO dataGangstas.transArchive (id, item, price, timeStamp, user) SELECT *, userIN from dataGangstas.currTrans;

UPDATE dataGangstas.transArchive SET transId = t_id where transId is NULL;
TRUNCATE TABLE dataGangstas.currTrans;
END

//

delimiter ;
