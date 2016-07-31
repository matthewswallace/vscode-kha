"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const fs = require('fs-extra');
const path = require('path');
const KhaExporter_1 = require('./KhaExporter');
const Converter_1 = require('../Converter');
const Haxe_1 = require('../Haxe');
const ImageTool_1 = require('../ImageTool');
const uuid = require('uuid');
class UnityExporter extends KhaExporter_1.KhaExporter {
    constructor(options) {
        super(options);
    }
    sysdir() {
        return 'unity';
    }
    haxeOptions(name, defines) {
        defines.push('no-root');
        defines.push('no-compilation');
        defines.push('sys_' + this.options.target);
        defines.push('sys_g1');
        defines.push('sys_g2');
        defines.push('sys_g3');
        defines.push('sys_g4');
        defines.push('sys_a1');
        return {
            from: this.options.from,
            to: path.join(this.sysdir(), 'Assets', 'Sources'),
            sources: this.sources,
            libraries: this.libraries,
            defines: defines,
            parameters: this.parameters,
            haxeDirectory: this.options.haxe,
            system: this.sysdir(),
            language: 'cs',
            width: this.width,
            height: this.height,
            name: name
        };
    }
    exportSolution(name, _targetOptions, defines) {
        return __awaiter(this, void 0, Promise, function* () {
            this.addSourceDirectory(path.join(this.options.kha, 'Backends', 'Unity'));
            fs.removeSync(path.join(this.options.to, this.sysdir(), 'Assets', 'Sources'));
            let result = yield Haxe_1.executeHaxe(this.options.to, this.options.haxe, ['project-' + this.sysdir() + '.hxml']);
            var copyDirectory = (from, to) => {
                let files = fs.readdirSync(path.join(__dirname, 'Data', 'unity', from));
                fs.ensureDirSync(path.join(this.options.to, this.sysdir(), to));
                for (let file of files) {
                    var text = fs.readFileSync(path.join(__dirname, 'Data', 'unity', from, file), { encoding: 'utf8' });
                    fs.writeFileSync(path.join(this.options.to, this.sysdir(), to, file), text);
                }
            };
            copyDirectory('Assets', 'Assets');
            copyDirectory('Editor', 'Assets/Editor');
            copyDirectory('ProjectSettings', 'ProjectSettings');
        });
    }
    /*copyMusic(platform, from, to, encoders, callback) {
        callback([to]);
    }*/
    copySound(platform, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            let ogg = yield Converter_1.convert(from, path.join(this.options.to, this.sysdir(), 'Assets', 'Resources', 'Sounds', to + '.ogg'), this.options.ogg);
            return [to + '.ogg'];
        });
    }
    copyImage(platform, from, to, asset) {
        return __awaiter(this, void 0, void 0, function* () {
            let format = yield ImageTool_1.exportImage(this.options.kha, from, path.join(this.options.to, this.sysdir(), 'Assets', 'Resources', 'Images', to), asset, undefined, false, true);
            return [to + '.' + format];
        });
    }
    copyBlob(platform, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            fs.copySync(from.toString(), path.join(this.options.to, this.sysdir(), 'Assets', 'Resources', 'Blobs', to + '.bytes'), { clobber: true });
            return [to];
        });
    }
    copyVideo(platform, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            return [to];
        });
    }
}
exports.UnityExporter = UnityExporter;
//# sourceMappingURL=UnityExporter.js.map