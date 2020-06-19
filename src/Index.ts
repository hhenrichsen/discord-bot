import { config } from 'dotenv';
config();

process.chdir(__dirname);
import {Shard, ShardingManager} from 'discord.js';
import logger = require('./services/logger');
const token = process.env.BOT_TOKEN;

const manager = new ShardingManager('./Bot.js', { token });
manager.spawn();

// @ts-ignore
manager.on('message', (shard : Shard, message : any) => {
    logger.info(`[Shard ${shard.id}] : ${message._eval} => ${message._result}`);
});

manager.on('shardCreate', shard => logger.info(`Launching new shard ${shard.id}.`));
