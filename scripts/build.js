'use strict';

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const packageDir = path.resolve(__dirname, '..', 'z_pmp-a330-fbw-compatibility');

fse.copySync(path.resolve(packageDir, 'SimObjects', 'Airplanes', 'amp-airbus-a330-300'), path.resolve(packageDir, 'SimObjects', 'Airplanes', 'amp-airbus-a330-300P2F'));
fse.removeSync(path.resolve(packageDir, 'SimObjects', 'Airplanes', 'amp-airbus-a330-300P2F', 'sound'));
fse.removeSync(path.resolve(packageDir, 'SimObjects', 'Airplanes', 'amp-airbus-a330-300P2F', 'TEXTURE.DEFAULT'));

function* readdir(d) {
    for (const dirent of fs.readdirSync(d, { withFileTypes: true })) {
        if (['layout.json', 'manifest.json'].includes(dirent.name)) {
            continue;
        }
        const resolved = path.join(d, dirent.name);
        if (dirent.isDirectory()) {
            yield* readdir(resolved);
        } else {
            yield resolved;
        }
    }
}

const MS_FILETIME_EPOCH = 116444736000000000n;

const contentEntries = [];
let totalPackageSize = 0;

for (const filename of readdir(packageDir)) {
    const stat = fs.statSync(filename, { bigint: true });
    contentEntries.push({
        path: path.relative(packageDir, filename.replace(path.sep, '/')),
        size: Number(stat.size),
        date: Number((stat.mtimeNs / 100n) + MS_FILETIME_EPOCH),
    });
    totalPackageSize += Number(stat.size);
}

fs.writeFileSync(path.join(packageDir, 'layout.json'), JSON.stringify({
    content: contentEntries,
}, null, 2));

fs.writeFileSync(path.join(packageDir, 'manifest.json'), JSON.stringify({
    ...require('../manifest-base.json'),
    package_version: require('../package.json').version,
    total_package_size: totalPackageSize.toString().padStart(20, '0'),
}, null, 2));
