// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Progress log for spec-chirho/progress-chirho.sqlite (table steps_taken_chirho).
 * One row per unit of work, not per shell command. Single writer: never log from parallel branches.
 *
 * Usage:
 *   bun spec-chirho/log_step_chirho.ts start <agent_code_chirho> "<action_taken_chirho>"
 *     → prints the new id_chirho
 *   bun spec-chirho/log_step_chirho.ts end <id_chirho> "<result_of_action_chirho>" "<overview_of_result_chirho>"
 */
import { Database } from 'bun:sqlite';

const DB_PATH_CHIRHO = `${import.meta.dir}/progress-chirho.sqlite`;
const USAGE_CHIRHO =
	'usage: log_step_chirho.ts start <agent_code> "<action>" | end <id> "<result>" "<overview>"';

function nowLocalChirho(): string {
	const dateChirho = new Date();
	const padChirho = (valueChirho: number): string => String(valueChirho).padStart(2, '0');
	const dayChirho = `${dateChirho.getFullYear()}-${padChirho(dateChirho.getMonth() + 1)}-${padChirho(dateChirho.getDate())}`;
	const timeChirho = `${padChirho(dateChirho.getHours())}:${padChirho(dateChirho.getMinutes())}:${padChirho(dateChirho.getSeconds())}`;
	return `${dayChirho} ${timeChirho}`;
}

function failChirho(messageChirho: string): never {
	console.error(messageChirho);
	process.exit(1);
}

const dbChirho = new Database(DB_PATH_CHIRHO);
dbChirho.run(`CREATE TABLE IF NOT EXISTS steps_taken_chirho (
	id_chirho INTEGER PRIMARY KEY AUTOINCREMENT,
	agent_code_chirho TEXT,
	timestamp_start_chirho TEXT,
	timestamp_end_chirho TEXT,
	action_taken_chirho TEXT,
	result_of_action_chirho TEXT,
	overview_of_result_chirho TEXT
)`);

const [commandChirho, ...argsChirho] = Bun.argv.slice(2);

if (commandChirho === 'start') {
	const [agentCodeChirho, actionTakenChirho] = argsChirho;
	if (!agentCodeChirho || !actionTakenChirho) failChirho(USAGE_CHIRHO);
	const rowChirho = dbChirho
		.query<{ id_chirho: number }, [string, string, string]>(
			`INSERT INTO steps_taken_chirho (agent_code_chirho, timestamp_start_chirho, action_taken_chirho)
			 VALUES (?, ?, ?) RETURNING id_chirho`
		)
		.get(agentCodeChirho, nowLocalChirho(), actionTakenChirho);
	if (!rowChirho) failChirho('insert returned no row');
	console.log(rowChirho.id_chirho);
} else if (commandChirho === 'end') {
	const [idTextChirho, resultChirho, overviewChirho] = argsChirho;
	const idChirho = Number(idTextChirho);
	if (!Number.isInteger(idChirho) || !resultChirho || !overviewChirho) failChirho(USAGE_CHIRHO);
	const changesChirho = dbChirho
		.query<never, [string, string, string, number]>(
			`UPDATE steps_taken_chirho
			 SET timestamp_end_chirho = ?, result_of_action_chirho = ?, overview_of_result_chirho = ?
			 WHERE id_chirho = ?`
		)
		.run(nowLocalChirho(), resultChirho, overviewChirho, idChirho).changes;
	if (changesChirho !== 1) failChirho(`no step with id_chirho ${idChirho}`);
	console.log(`ended ${idChirho}`);
} else {
	failChirho(USAGE_CHIRHO);
}
