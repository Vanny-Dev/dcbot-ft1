const { Database } = require('sqlite3');
 
const db = new Database("app.db"); 

function initializeDB(){
	db.run(`create table if not exists levels (
		userId text primary key unique,
		level integer,
		xp integer
	)`.trim());
	return db;
}

module.exports = { initializeDB }
