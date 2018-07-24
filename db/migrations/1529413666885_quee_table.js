module.exports = {
    up: "CREATE TABLE `queue` (`id` int(10) unsigned NOT NULL AUTO_INCREMENT, `notification_id` int(10) unsigned DEFAULT NULL, `subscriber_id` int(10) unsigned DEFAULT NULL, `viewed` int(1) NOT NULL DEFAULT '0', PRIMARY KEY (`id`), KEY `notification_id` (`notification_id`), KEY `subscriber_id` (`subscriber_id`), CONSTRAINT `quee_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notifications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `quee_ibfk_2` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;",
    down: 'DROP TABLE `queue`;',
};
