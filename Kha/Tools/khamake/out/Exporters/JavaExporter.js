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
const ImageTool_1 = require('../ImageTool');
const HaxeProject_1 = require('../HaxeProject');
class JavaExporter extends KhaExporter_1.KhaExporter {
    constructor(options) {
        super(options);
    }
    sysdir() {
        return 'java';
    }
    haxeOptions(name, targetOptions, defines) {
        defines.push('no-compilation');
        defines.push('sys_' + this.options.target);
        defines.push('sys_g1');
        defines.push('sys_g2');
        defines.push('sys_a1');
        return {
            from: this.options.from,
            to: path.join(this.sysdir(), 'Sources'),
            sources: this.sources,
            libraries: this.libraries,
            defines: defines,
            parameters: this.parameters,
            haxeDirectory: this.options.haxe,
            system: this.sysdir(),
            language: 'java',
            width: this.width,
            height: this.height,
            name: name
        };
    }
    exportSolution(name, _targetOptions, defines) {
        return __awaiter(this, void 0, Promise, function* () {
            this.addSourceDirectory(path.join(this.options.kha, 'Backends', this.backend()));
            fs.ensureDirSync(path.join(this.options.to, this.sysdir()));
            let haxeOptions = this.haxeOptions(name, _targetOptions, defines);
            HaxeProject_1.writeHaxeProject(this.options.to, haxeOptions);
            fs.removeSync(path.join(this.options.to, this.sysdir(), 'Sources'));
            this.exportEclipseProject();
            return haxeOptions;
        });
    }
    backend() {
        return 'Java';
    }
    exportEclipseProject() {
        this.writeFile(path.join(this.options.to, this.sysdir(), '.classpath'));
        this.p("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        this.p("<classpath>");
        this.p("\t<classpathentry kind=\"src\" path=\"Sources/src\"/>");
        this.p("\t<classpathentry kind=\"con\" path=\"org.eclipse.jdt.launching.JRE_CONTAINER\"/>");
        this.p("\t<classpathentry kind=\"output\" path=\"bin\"/>");
        this.p("</classpath>");
        this.closeFile();
        this.writeFile(path.join(this.options.to, this.sysdir(), '.project'));
        this.p("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        this.p("<projectDescription>");
        this.p("\t<name>" + path.parse(this.options.to).name + "</name>");
        this.p("\t<comment></comment>");
        this.p("\t<projects>");
        this.p("\t</projects>");
        this.p("\t<buildSpec>");
        this.p("\t\t<buildCommand>");
        this.p("\t\t\t<name>org.eclipse.jdt.core.javabuilder</name>");
        this.p("\t\t\t<arguments>");
        this.p("\t\t\t</arguments>");
        this.p("\t\t</buildCommand>");
        this.p("\t</buildSpec>");
        this.p("\t<natures>");
        this.p("\t\t<nature>org.eclipse.jdt.core.javanature</nature>");
        this.p("\t</natures>");
        this.p("</projectDescription>");
        this.closeFile();
    }
    /*copyMusic(platform, from, to, encoders) {
        this.copyFile(from, this.directory.resolve(this.sysdir()).resolve(to + '.wav'));
        callback([to + '.wav']);
    }*/
    copySound(platform, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            fs.copySync(from.toString(), path.join(this.options.to, this.sysdir(), to + '.wav'), { clobber: true });
            return [to + '.wav'];
        });
    }
    copyImage(platform, from, to, asset) {
        return __awaiter(this, void 0, void 0, function* () {
            let format = yield ImageTool_1.exportImage(this.options.kha, from, path.join(this.options.to, this.sysdir(), to), asset, undefined, false);
            return [to + '.' + format];
        });
    }
    copyBlob(platform, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            fs.copySync(from.toString(), path.join(this.options.to, this.sysdir(), to), { clobber: true });
            return [to];
        });
    }
    copyVideo(platform, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            return [to];
        });
    }
}
exports.JavaExporter = JavaExporter;
//# sourceMappingURL=JavaExporter.js.map