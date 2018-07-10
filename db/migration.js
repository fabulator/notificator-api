import mysql from 'mysql';
import promiseMysql from 'promise-mysql';
import migration from 'mysql-migrations';
import { MYSQL_SETTINGS } from './../src/config';

(async () => {
    (await promiseMysql.createConnection({
        host: MYSQL_SETTINGS.host,
        password: MYSQL_SETTINGS.password,
        user: MYSQL_SETTINGS.user,
    })).query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_SETTINGS.database};`);

    const connection = mysql.createPool({
        connectionLimit: 10,
        ...MYSQL_SETTINGS,
    });

    process.argv.push('up');
    migration.init(connection, `${__dirname}/../db/migrations`);
})();
