#!/usr/bin/mongosh --quiet

const fs = require('fs');
const { promisify } = require('util')

const readdir = promisify(fs.readdir);

async function get_files() {
    let files = await readdir('.')
    files = files.filter(f => f.endsWith('db-seed.json'))
    console.log({ files })
    return files
}

async function load_data(files) {
    for (const f of files) {
        const json = require(`./${f}`)

        for await (const dbname of Object.keys(json)) {
            await load(dbname, json[dbname])
        }
    }
}

async function load(dbname, data_infos) {
    db = db.getSiblingDB(dbname)
    for await (const data_info of data_infos) {
        const { column_name, data } = data_info;
        if (!data.length) {
            continue
        }

        await db[column_name].insertMany(data)

    }
}

async function main() {
    await load_data(await get_files())
}

main()