// 日志存储
const log4js = require('log4js')
const levels = {
    'trace':log4js.levels.TRACE,
    'debug':log4js.levels.DEBUG,
    'info':log4js.levels.INFO,
    'warn':log4js.levels.WARN,
    'error':log4js.levels.ERROR,
    'fatal':log4js.levels.FATAL,
}

log4js.configure({
    appenders:{
        console:{type:'console'},
        info:{
            type:'file',
            filename:'logs/all-logs.log'
        },
        error:{
            type:'dateFile',
            filename:'logs/log',
            pattern:'yyyy-MM-dd.log',
            // 設置文件的名稱是 filename+pattern
            alwaysIncludePattern:true
        }
    },
    categories:{
        default:{
            appenders:['console'],
            level:'debug',
        },
        info:{
            appenders:['info','console'],
            level:'info'
        },
        error:{
            appenders:['error','console'],
            level:'error'
        }
    }
});

// 日誌輸出，level為debug
exports.debug = (content) =>{
    const logger = log4js.getLogger();
    logger.level = levels.debug;
    logger.info(content);
}

// 日誌輸出，level為info
exports.info = (content) =>{
    const logger = log4js.getLogger('info');
    logger.level = levels.info;
    logger.info(content);
}

// 日誌輸出，level為error
exports.error = (content) =>{
    const logger = log4js.getLogger('error');
    logger.level = levels.error;
    logger.info(content);
}