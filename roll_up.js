const fs = require('fs');
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
function getFieldElementF12(bn128, pR) {
    debugger
    return [
        [
            [
                bn128.instance.get(pR),
                pb.get(pR+32),
            ],[
                pb.get(pR+32*2),
                pb.get(pR+32*3),
            ],[
                pb.get(pR+32*4),
                pb.get(pR+32*5),
            ]
        ],[
            [
                pb.get(pR+32*6),
                pb.get(pR+32*7),
            ],[
                pb.get(pR+32*8),
                pb.get(pR+32*9),
            ],[
                pb.get(pR+32*10),
                pb.get(pR+32*11),
            ]
        ]
    ];
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
        const proof_a_p = ['14567039575197480528119959961327714497845927467213154926371421015062300663263', '1000373253310235159656639300753059983014930924649970939079246556995097557245']
        const p2 = [/*TODO*/]	 

        const vk_a = [['72845808812592855736508517959950295400388085950499134060650391241680795014710', '78100026775956249164162204243472275528800871643742955729366952509822072757435'], ['76475013071130644230541689872427101644031042132633025313035776555027131176700', '30658591281525740283719694118570154825985583194697552416269170562378337253327']]
        
        const pProofA = bn128.alloc(SIZE_F * 3);
        const pVKA = bn128.alloc(SIZE_F * 6);
        const pCoef = bn128.alloc(SIZE_F * 6 +  SIZE_F * 6 * 103);

        const pProofAP = bn128.alloc(SIZE_F * 3);
        /*
        const pPreP = bn128.alloc(SIZE_F * 3);
        const pG2s = bn128.alloc(SIZE_F * 6);
        const pPreQ = bn128.alloc(SIZE_F*2*3 + SIZE_F*2*3*103);
        */

        bn128.setG1(pProofA, proof_a) // same as setG1Affine
        bn128.instance.exports.f1m_one(pProofA + SIZE_F * 2);
        //bn128.instance.exports.g1m_toMontgomery(pProofA, pProofA)
        bn128.setG2Affine(pVKA, vk_a)
        //bn128.instance.exports.f2m_one(pVKA + SIZE_F * 4);

        //bn128.instance.exports.g2m_toMontgomery(pVKA, pVKA)

        let pAux = bn128.alloc(SIZE_F * 12);
        let pAux2 = bn128.alloc(SIZE_F * 12);
        let pAux3 = bn128.alloc(SIZE_F * 12);
        bn128.instance.exports.ftm_one(pAux);

        bn128.instance.exports.bn128_prepareG1(bn128.pG1gen, pProofA);
        console.log("G1");
        console.log(buf2hex(bn128.getBin(pProofA, SIZE_F * 3)));

        //bn128.instance.exports.g2m_toMontgomery(pVKA, pVKA)

        console.log("G2");
        console.log(buf2hex(bn128.getBin(pVKA, SIZE_F)));
        console.log(buf2hex(bn128.getBin(pVKA + SIZE_F, SIZE_F)));
        console.log(buf2hex(bn128.getBin(pVKA + SIZE_F * 2, SIZE_F)));
        console.log(buf2hex(bn128.getBin(pVKA + SIZE_F * 3, SIZE_F)));
        console.log(buf2hex(bn128.getBin(pVKA + SIZE_F * 4, SIZE_F)));
        console.log(buf2hex(bn128.getBin(pVKA + SIZE_F * 5, SIZE_F)));

        bn128.instance.exports.bn128_prepareG2(pVKA, pCoef);

        console.log("pcoef");
        for (let i = 0; i < 6*104; i++) {
            console.log(buf2hex(bn128.getBin(pCoef+SIZE_F*i, SIZE_F)));
        }


        /*
        bn128.instance.exports.bn128_millerLoop(pPreP, pPreQ, pAux2);
        bn128.instance.exports.bn128_finalExponentiation(pAux2, pAux3);
        */


        //let f = getFieldElementF12(bn128, pAux3);
        //console.log(f)

        console.log("pairing result");

        /*
        for (let i = 0; i < 12; i++) {
            console.log(buf2hex(bn128.getBin(pAux3+SIZE_F*i, SIZE_F)));
        }
        */

        /*
        for (let i = 0; i < 6*104; i++) {
            console.log(buf2hex(bn128.getBin(pAux3+SIZE_F*i, SIZE_F )));
        }
        */
    }
    zk.verify();
});
