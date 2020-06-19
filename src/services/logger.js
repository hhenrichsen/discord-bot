const winston = require('winston');
const util = require('util');
const winstonDailyRotateFile = require('winston-daily-rotate-file');

const logFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
        info => `[${info.timestamp} ${info.level}] ${info.message}`,
    ),
);

winston.loggers.add('consoleLogger', {
    format: logFormat,
    transports: [
        new winstonDailyRotateFile({
            filename: '../logs/%DATE%.log',
            datepattern: 'YYYY-MM-DD',
            level: 'info',
        }),
        new winston.transports.Console({
            level: 'silly',
        }),
    ],
});

module.exports = winston.loggers.get('consoleLogger');