#!/usr/bin/mongosh --quiet

const fs = require('fs');
const { promisify } = require('util')

const readdir = promisify(fs.readdir);

async function get_files() {
    let files = await readdir('.')
    files = files.filter(f => f.endsWith('db-index.json'))
    console.log({ files })
    return files
}

async function load_indexes(files) {
    for (const f of files) {
        const json = require(`./${f}`)

        for await (const dbname of Object.keys(json)) {
            await load(dbname, json[dbname])
        }
    }
}

async function load(dbname, index_infos) {
    db = db.getSiblingDB(dbname)
    for await (const index_info of index_infos) {
        const { column_name, indexes } = index_info;
        if (!indexes.length) {
            continue
        }

        for await (const index of indexes) {
            console.log('creating index: ', { index })
            await db[column_name].createIndex(
                index[0],
                index[1]
            )
        }
    }
}

async function main() {
    await load_indexes(await get_files())
}

main()