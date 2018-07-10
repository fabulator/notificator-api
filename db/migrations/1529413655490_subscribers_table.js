module.exports = {
    up: 'CREATE TABLE `subscribers` (`id` int(10) unsigned NOT NULL AUTO_INCREMENT, `endpoint` varchar(255) COLLATE utf8_czech_ci NOT NULL, `body` text COLLATE utf8_czech_ci, `namespace` varchar(255) COLLATE utf8_czech_ci NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;',
    down: 'DROP TABLE `subscribers`;',
};
