import mysql from 'mysql';
import migration from 'mysql-migrations';
import { MYSQL_SETTINGS } from './../src/config';

const connection = mysql.createPool({
    connectionLimit: 10,
    ...MYSQL_SETTINGS,
});

migration.init(connection, `${__dirname}/../db/migrations`);
