import {VBOInstancingLayer} from "../../VBOInstancingLayer";
import {VBOInstancingRenderer} from "../../VBOInstancingRenderer";

/**
 * @private
 */
export class VBOTrianglesInstancingDrawRenderer extends VBOInstancingRenderer {

    getHash(): string {
        return `${this.lambertShadingHash}-${this.slicingHash}`;
    }

    buildVertexShader(src: string[]): void {
        this.vertexHeader(src);
        this.vertexCommonDefs(src);
        this.vertexInstancingTransformDefs(src);
        this.vertexSlicingDefs(src);
        this.vertexDrawLambertDefs(src);
        // this.vertexColorMainOpenBlock(src);
        src.push("void main(void) {");
        {
            this.vertexDrawInstancingTransformLogic(src);
            this.vertexDrawLambertLogic(src);
            this.vertexSlicingLogic(src);
        }
      //  this.vertexColorMainCloseBlock(src);
        src.push("}");
    }

    buildFragmentShader(src: string[]): void {
        this.fragmentHeader(src);
        this.fragmentPrecisionDefs(src);
        this.fragmentSlicingDefs(src);
        this.fragmentDrawLambertDefs(src);
        src.push("void main(void) {");
        {
            this.fragmentSlicingLogic(src);
            this.fragmentDrawLambertLogic(src);
        }
        src.push("}");
    }

    drawVBOInstancingLayerPrimitives(vboInstancingLayer: VBOInstancingLayer, renderPass: number): void {
        const gl = this.renderContext.gl;
        const renderState = vboInstancingLayer.renderState;
        gl.drawElementsInstanced(gl.TRIANGLES, renderState.indicesBuf.numItems, renderState.indicesBuf.itemType, 0, renderState.numInstances);
    }
}
