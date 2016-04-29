"use strict";

const Exporter = require('./Exporter.js');
const Files = require('./Files.js');
const Paths = require('./Paths.js');
const GraphicsApi = require('./GraphicsApi.js');
const Options = require('./Options.js');
const Platform = require('./Platform.js');
const fs = require('fs-extra');

class ExporterMakefile extends Exporter {
	constructor() {
		super();
	}

	exportSolution(solution, from, to, platform, vrApi, nokrafix, options) {
		let project = solution.getProjects()[0];

		let objects = {};
		let ofiles = {};
		for (let fileobject of project.getFiles()) {
			let file = fileobject.file;
			if (file.endsWith(".cpp") || file.endsWith(".c") || file.endsWith("cc")) {
				let name = file.toLowerCase();
				if (name.indexOf('/') >= 0) name = name.substr(name.lastIndexOf('/') + 1);
				name = name.substr(0, name.lastIndexOf('.'));
				if (!objects[name]) {
					objects[name] = true;
					ofiles[file] = name;
				}
				else {
					while (objects[name]) {
						name = name + "_";
					}
					objects[name] = true;
					ofiles[file] = name;
				}
			}
		}
		
		let gchfilelist = '';
		let precompiledHeaders = [];
		for (let file of project.getFiles()) {
			if (file.options && file.options.pch && precompiledHeaders.indexOf(file.options.pch) < 0) {
				precompiledHeaders.push(file.options.pch);
			}
		}
		for (let file of project.getFiles()) {
			let precompiledHeader = null;
			for (let header of precompiledHeaders) {
				if (file.file.endsWith(header)) {
					precompiledHeader = header;
					break;
				}
			}
			if (precompiledHeader !== null) {
				let realfile = to.relativize(from.resolve(file.file));
				gchfilelist += realfile + '.gch ';
			}
		}
		
		let ofilelist = '';
		for (let o in objects) {
			ofilelist += o + '.o ';
		}
		
		this.writeFile(to.resolve('makefile'));

		let incline = '';
		for (let inc of project.getIncludeDirs()) {
			inc = to.relativize(from.resolve(inc));
			incline += '-I' + inc + ' ';
		}
		this.p('INC=' + incline);

		let libsline = '-static-libgcc -static-libstdc++ -pthread';
		for (let lib of project.getLibs()) {
			libsline += ' -l' + lib;
		}
		this.p('LIB=' + libsline);

		let defline = '';
		for (let def of project.getDefines()) {
			defline += '-D' + def + ' ';
		}
		this.p('DEF=' + defline);
		this.p();

		let optimization = '';
		if (!options.debug) optimization = '-O3';

		this.p(project.getName() + ': ' + gchfilelist + ofilelist);
		
		let cpp = '';
		if (project.cpp11) {
			cpp = '-std=c++11'
		}

		this.p('\tg++ ' + cpp + ' ' + optimization + ' ' + ofilelist + ' -o "' + project.getName() + '" $(LIB)');
		
		for (let file of project.getFiles()) {
			let precompiledHeader = null;
			for (let header of precompiledHeaders) {
				if (file.file.endsWith(header)) {
					precompiledHeader = header;
					break;
				}
			}
			if (precompiledHeader !== null) {
				let realfile = to.relativize(from.resolve(file.file));
				this.p(realfile + '.gch: ' + realfile);
				let compiler = 'g++';
				this.p('\t' + compiler + ' ' + cpp + ' ' + optimization + ' $(INC) $(DEF) -c ' + realfile + ' -o ' + realfile + '.gch $(LIB)');
			}
		}

		for (let fileobject of project.getFiles()) {
			let file = fileobject.file;
			if (file.endsWith('.c') || file.endsWith('.cpp') || file.endsWith('cc')) {
				this.p();
				let name = ofiles[file];
				let realfile = to.relativize(from.resolve(file));
				this.p(name + '.o: ' + realfile);
				let compiler = 'g++';
				if (file.endsWith('.c')) compiler = 'gcc';
				this.p('\t' + compiler + ' ' + cpp + ' ' + optimization + ' $(INC) $(DEF) -c ' + realfile + ' -o ' + name + '.o $(LIB)');
			}
		}

		//project.getDefines()
		//project.getIncludeDirs()

		this.closeFile();
	}
}

module.exports = ExporterMakefile;
