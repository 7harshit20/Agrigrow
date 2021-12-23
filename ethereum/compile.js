const path = require('path')
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const agrigrowPath = path.resolve(__dirname, 'contract', 'Agrigrow.sol');
const source = fs.readFileSync(agrigrowPath, 'utf-8');

const input = {
    language: 'Solidity',
    sources: {
        'Agrigrow.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

const compiled = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Agrigrow.sol'];

fs.ensureDirSync(buildPath);

for (let contract in compiled) {
    fs.outputJSONSync(path.resolve(buildPath, contract + '.json'),
        compiled[contract]
    );
}

