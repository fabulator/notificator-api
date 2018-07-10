module.exports = {
    up: 'CREATE TABLE `notifications` (`id` int(10) unsigned NOT NULL AUTO_INCREMENT, `body` text COLLATE utf8_czech_ci, PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;',
    down: 'DROP TABLE `notifications`;',
}

