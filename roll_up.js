const fs = require('fs');
const buildProtoboard = require("wasmbuilder").buildProtoboard;
const buildBn128 = require("./src/bn128.js");
const bigInt = require('big-integer')
const SIZE_F = 32
const assert = require('assert');
let zk = {};

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer).reverse(), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function printFq12(bn128, p) {
    const SIZE_F = 32;

    for (let i = 0; i < 12; i++) {
        console.log(buf2hex(bn128.getBin(p + SIZE_F * i, SIZE_F)));
    }
}

function printFq2(bn128, pG2) {
    const SIZE_F = 32;

    for (let i = 0; i < 6; i++) {
        console.log(buf2hex(bn128.getBin(pG2 + SIZE_F * i, SIZE_F)));
    }
}

function printFq1(bn128, pG1) {
    const SIZE_F = 32;

    for (let i = 0; i < 3; i++) {
        console.log(buf2hex(bn128.getBin(pG1 + SIZE_F * i, SIZE_F)));
    }
}

buildBn128().then( (bn128) => {
    zk.bn128 = bn128;

    zk.verify = function () {
        const SIZE_F = 32;
        const pG1gen = bn128.pG1gen;
        const pG2gen = bn128.pG2gen;
let preP = ['19701616998046022080031461533081683349349922508001225829429012682476945246503', '4352758313510687066057119517114580848942993880722958718643736130532801935422'] // proof A
        let G2s= [["15771427421120862986294000212419350237883255916169077454872740902908345027224", "1678675047549670880963791769225832602838608436817213884204913291250317772076"],
 ["7444893162152145494570035985825645193382869031140049547391326164069968393793", "1528292178025870369960381247712364755513316922130874453557341293710701266878"]] // vk A

        const proof_a = ['3899884854253260798287194420681390195129018418001849829799377663377613160511', '17587230345392365712430620877997915478595991565328899965814307903212716007332']
       /*
       const vk_a = [["10158637525057481760056375716221076310331756939873412782566291572681344016716", "16548728159780093650905724596480242950527136765259244416289285297574698562603"],
 ["12031064823122150770091404076492969192448060276855277898032078516074409935901", "17060574385764455113052073757045274655042048873252862760623781185577070940947"]];
 */
        const neg_proof_a_p = [bigInt('0c0e329b4d73cd52c231f9e064460a7a9f77c7c8752c26efc52e6c7f37d02193', 16), bigInt('25f5bae6cf6720e4519b0c6d5b4d6950c116c773a7869909ea0ef64fc73d9ad1', 16)];
        const p2 = [[bigInt('19573841af96503bfbb8264797811adfdceb1935497b01728e83b5d102bc2026', 16), bigInt('14fef0833aea7b6b09e950fc52a02f866043dd5a5802d8c4afb4737da84c6140', 16)], [bigInt('0da4a0e693fd648255f935be33351076dc57f922327d3cbb64095b56c71856ee', 16), bigInt('28fd7eebae9e4206ff9e1a62231b7dfefe7fd297f59e9b78619dfa9d886be9f6', 16)]];

        /*
        const vk_a = [['72845808812592855736508517959950295400388085950499134060650391241680795014710', '78100026775956249164162204243472275528800871643742955729366952509822072757435'], ['76475013071130644230541689872427101644031042132633025313035776555027131176700', '30658591281525740283719694118570154825985583194697552416269170562378337253327']]
        */

        const vk_a = [
                      [bigInt("2c191ae34b6b9b4a8598a7b98c851636a10d4444fea44189f22d894dffae6794",16), bigInt("0a6cdc207a41c5e07072ef58074f9cbbacab0c74dcbf2e8594f90db9874e9782", 16)],
                      [bigInt("25382aec8d64292e5ab5b95741fe96fca91352d092c983007f7932bb7e79e30c",16), bigInt("2ebdd522ff0a7bffbb1e26764cea77cf43c825d18749d421006c7d91da93d25e",16)]
                     ]
        
        const pProofA = bn128.alloc(SIZE_F * 3);
        const pVKA = bn128.alloc(SIZE_F * 6);
        const pCoef = bn128.alloc(SIZE_F * 6 +  SIZE_F * 6 * 103);

        const pP2 = bn128.alloc(SIZE_F * 6);
        const pNegAP = bn128.alloc(SIZE_F * 3);
        const pOne = bn128.alloc(SIZE_F * 12);

        bn128.setG1(pProofA, proof_a) // same as setG1Affine
        //bn128.instance.exports.f1m_one(pProofA + SIZE_F * 2);
        bn128.instance.exports.g1m_toMontgomery(pProofA, pProofA)

        // I think pVKA is already in montgomery form?
        bn128.setG2Affine(pVKA, vk_a);

        bn128.setG1(pNegAP, neg_proof_a_p);
        //bn128.instance.exports.g1m_toMontgomery(pNegAP, pNegAP);

        bn128.setG2Affine(pP2, p2);
        bn128.instance.exports.f2m_one(pP2 + SIZE_F * 4);
        //bn128.instance.exports.g2m_toMontgomery(pP2, pP2);

        console.log("pProofA is ");
        printFq1(bn128, pProofA);

        console.log("vk_a is ");

        printFq2(bn128, pVKA);

        console.log("negated point AP is");
        //console.log(buf2hex(bn128.getBin(pVKA, SIZE_F)));
        printFq1(bn128, pNegAP);

        console.log("point 2 is");
        printFq2(bn128, pP2);

        console.log("computing pairing....");

        //bn128.instance.exports.g2m_toMontgomery(pVKA, pVKA)

        let pAux = bn128.alloc(SIZE_F * 12);

        assert(bn128.instance.exports.bn128_pairingEq2(pProofA, pVKA, pNegAP, pP2, bn128.pOneT));

        console.log("pairing check successful");
    }
    zk.verify();
});
