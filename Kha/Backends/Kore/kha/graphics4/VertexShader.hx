package kha.graphics4;

import haxe.io.Bytes;
import kha.Blob;

@:headerCode('
#include <Kore/pch.h>
#include <Kore/Graphics/Graphics.h>
')

@:cppFileCode('
#ifndef INCLUDED_haxe_io_Bytes
#include <haxe/io/Bytes.h>
#endif
')

@:headerClassCode("Kore::Shader* shader;")
class VertexShader {
	public function new(source: Blob, file: String) {
		initVertexShader(source);
		//cpp.vm.Gc.setFinalizer(this, cpp.Function.fromStaticFunction(destroy)); // TODO
	}
	
	@:void private static function destroy(shader: VertexShader): Void {
		untyped __cpp__('delete shader->shader;');
	}
	
	@:functionCode("
		shader = new Kore::Shader(source->bytes->b->Pointer(), source->get_length(), Kore::VertexShader);
	")
	private function initVertexShader(source: Blob): Void {
		
	}
}
