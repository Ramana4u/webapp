var path = require('path')
var fs = require('fs')

var configuration =
`
var path = require('path')

module.exports =
{
	client: 'myrds.cyhtjvsnjph3.us-east-2.rds.amazonaws.com',
	connection:
	{
		database: 'webapp',
		user:     'postgres',
		password: 'ramana4u2021'
	},
	pool:
	{
		min: 2,
		max: 10
	},
	migrations:
	{
		directory: path.join(__dirname, 'database/sql/migrations'),
		tableName: 'knex_migrations'
	}
}
`

fs.writeFileSync(path.resolve(__dirname, 'knexfile.js'), configuration.trim())
