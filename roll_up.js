const buildProtoboard = require("wasmbuilder").buildProtoboard;
const buildBn128 = require("./src/bn128.js");
const SIZE_F = 32
let zk = {};

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

/*
async function do_all() {
    bn128 = {}
    pb = await buildProtoboard((module) => {
        buildBn128(module);
    }, 32); 
}
*/

buildBn128().then( (bn128) => {
    zk.bn128 = bn128;

    zk.verify = function () {
        const SIZE_F = 32;
        const pG1gen = bn128.pG1gen;
        const pG2gen = bn128.pG2gen;

        let preP = ['56709467388436693914484072417209903338388156998046132361935685474260385915364', '83082901452509517103365446527050808340747622259167155801462113036492256216086']
        let G2s= [['62097864654795263299777315818596730873357024706062039334587571703812981779656', '59859334692672627168085383671113456833169953709165975848711675464534463460664'], ['94818091094935909491457394517312293566946551205775272463008924017900696483827', '22056990281339530081242807786570620857253103589777080682394010675305993893379']];

        const pPreP = bn128.alloc(SIZE_F * 3);
        const pG2s = bn128.alloc(SIZE_F * 6);
        const pPreQ = bn128.alloc(SIZE_F*2*3 + SIZE_F*2*3*103);

        bn128.setG1(pPreP, preP) // same as setG1Affine
        bn128.setG2Affine(pG2s, G2s)

        let pAux = bn128.alloc(SIZE_F * 12);
        let pAux2 = bn128.alloc(SIZE_F * 12);
        let pAux3 = bn128.alloc(SIZE_F * 12);
        bn128.instance.exports.ftm_one(pAux);

        bn128.instance.exports.bn128_prepareG1(bn128.pG1gen, pPreP);
        console.log("G1");
        console.log(buf2hex(bn128.getBin(pPreP, SIZE_F * 3)));


        console.log("G2");
        console.log(buf2hex(bn128.getBin(pG2s, SIZE_F)));
        console.log(buf2hex(bn128.getBin(pG2s + SIZE_F, SIZE_F)));
        console.log(buf2hex(bn128.getBin(pG2s + SIZE_F * 2, SIZE_F)));
        console.log(buf2hex(bn128.getBin(pG2s + SIZE_F * 3, SIZE_F)));
        console.log(buf2hex(bn128.getBin(pG2s + SIZE_F * 4, SIZE_F)));
        console.log(buf2hex(bn128.getBin(pG2s + SIZE_F * 5, SIZE_F)));

        bn128.instance.exports.bn128_prepareG2(pG2s, pPreQ);

        console.log("coeffs");
        console.log(buf2hex(bn128.getBin(pPreQ, SIZE_F)));

        bn128.instance.exports.bn128_millerLoop(pPreP, pPreQ, pAux2);
        bn128.instance.exports.bn128_finalExponentiation(pAux2, pAux3);

        console.log("pairing result");
        for (let i = 0; i < 12; i++) {
            console.log(buf2hex(bn128.getBin(pAux3+SIZE_F*i, SIZE_F )));
        }
    }
    zk.verify();
});
