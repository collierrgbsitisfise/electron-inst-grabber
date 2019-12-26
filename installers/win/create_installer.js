const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
    .then(createWindowsInstaller)
    .then(info => {
        console.log('success !');
        console.log(info);
    })
    .catch((error) => {
        console.log('error');
        console.log(error);
        process.exit(1)
    })

function getInstallerConfig() {
    console.log('creating windows installer');
    const rootPath = path.join('./');
    const buildPath = path.join(rootPath, 'release-builds');
    const outPath = path.join(rootPath, 'release-installer');

    return Promise.resolve({
        appDirectory: path.join(buildPath, 'instagrabber-win32-x64'),
        authors: 'Vadim Nicolaev',
        noMsi: true,
        outputDirectory: path.join(outPath, 'win'),
        exe: 'instagrabber.exe',
        setupExe: 'instagrabberInstaller.exe',
        setupIcon: path.join(rootPath, 'assets', 'icons', 'win', 'icon.ico')
    })
}