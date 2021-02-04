import * as Cesium from "cesium";

function fixGltf(gltf) {
    if (!gltf.extensionsUsed) {
        return;
    }

    const v = gltf.extensionsUsed.indexOf("KHR_technique_webgl");
    const t = gltf.extensionsRequired.indexOf("KHR_technique_webgl");
    if (v !== -1) {
        gltf.extensionsRequired.splice(t, 1, "KHR_techniques_webgl");
        gltf.extensionsUsed.splice(v, 1, "KHR_techniques_webgl");
        gltf.extensions = gltf.extensions || {};
        gltf.extensions["KHR_techniques_webgl"] = {};
        gltf.extensions["KHR_techniques_webgl"].programs = gltf.programs;
        gltf.extensions["KHR_techniques_webgl"].shaders = gltf.shaders;
        gltf.extensions["KHR_techniques_webgl"].techniques = gltf.techniques;
        const techniques = gltf.extensions["KHR_techniques_webgl"].techniques;

        gltf.materials.forEach(function (mat, index) {
            gltf.materials[index].extensions["KHR_technique_webgl"].values = gltf.materials[index].values;
            gltf.materials[index].extensions["KHR_techniques_webgl"] = gltf.materials[index].extensions["KHR_technique_webgl"];

            const vtxfMaterialExtension = gltf.materials[index].extensions["KHR_techniques_webgl"];

            for (const value in vtxfMaterialExtension.values) {
                const us = techniques[vtxfMaterialExtension.technique].uniforms;
                for (const key in us) {
                    if (us[key] === value) {
                        vtxfMaterialExtension.values[key] = vtxfMaterialExtension.values[value];
                        delete vtxfMaterialExtension.values[value];
                        break;
                    }
                }
            }
        });

        techniques.forEach(function (t) {
            for (const attribute in t.attributes) {
                const name = t.attributes[attribute];
                t.attributes[attribute] = t.parameters[name];
            }
            for (const uniform in t.uniforms) {
                const name = t.uniforms[uniform];
                t.uniforms[uniform] = t.parameters[name];
            }
        });
    }
}

Object.defineProperties(Cesium.Model.prototype, {
    _cachedGltf: {
        set: function (value) {
            this._vtxf_cachedGltf = value;
            if (this._vtxf_cachedGltf && this._vtxf_cachedGltf._gltf) {
                fixGltf(this._vtxf_cachedGltf._gltf);
            }
        },
        get: function () {
            return this._vtxf_cachedGltf;
        }
    }
});
