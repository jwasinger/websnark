//const vk = { 'a': [['16088229701198168742598877046340405716258280387086005018061868785503310095738', '20238530297035609524849784305485774740942627026318630091487927246858404197035', "1"], ['19892694738064394099730009846660952083560874715239724924484413172662033821973', '1055840522773402232311980840058999187193463470366144739765987112365110123304', "1"]] }

const vk = { 'a' : [["5836397365806991699238331686509853236257493599560939199746838422079370756440", "14498019459264024289872607154755457176412209611044669225635086490493697887487"], ["9212702797230883428664223819608740013216535761261112463809998493420046124620", "14377953302267034069716996284966010497610506310836905758307855295853207038819"]] };

/*
const proof = {"a": ["8101821407142431521291764317689918300673680361075680840890613284590881361090", "11188528619562267138106591416845761751256898941415261417424373582469865096768", "1"], "a_p": ["19606299122199532454450118976810935520081075164153121050769727751298007159034", "15857089354639735753471417565471769743721157556354035445450150505726079565978", "1"], "b": [["1193899284414344884939581528507696119069326151812354449067751161943021270807", "10596712396198770470036141769130790532480968641024664152359006376635697799116", "1"], ["17907817161027600387956385399852324604915775864432856183848213408830694799127", "17672380469009572773919645209712306332616649472803550332313479336620129122245", "1"]], "b_p": ["14467365953033168477313502505208986438316735567670072407289037786275813800439", "6138396842555231515277351211225655169530837893982133813295501059207970878866", "1"], "c": ["18244512191373922178068269556360801787659247215895130362997383922678954242323", "13032816726359756142055485830722858331883858702238820205265977535858005301949", "1"], "c_p": ["15695594638794200005262073157014628920668543364289904898759303711316110500147", "10154130232415526629036276170723145685516407994167474739439413246452103132897", "1"], "h": ["12461863069689606723298763725553616722952836258699737918710411673526871008461", "15191551311833286030750129143933770258349566421941945320133351922427908714766", "1"], "k": ["19899164578423057654302432609455168520037892378828718711027472793314590019403", "19972990059386613567146759459600521004766368063604638323204768588760336006326", "1"], "input": ["10023990726703916044346885959154654865524949824588662605098551026192542737871", "2", "12179642599921583044492796414072058817245043511036050444086056572891590802390", "4", "1922921700301673738659831850011930844888547773281558769808146861610944864629", "9299250400689089910240682594415691479114552969120829821387576864786494048524", "1"]}
*/

const proof = {'a': ["1552128594654368351083796535594116813734406424806257637308740710603242922249", "13578188914818394352393473634082280616697717651491779678500934634231151805332", "1"], 'a_p': ["10983143141225590290103220887397344143573907711685958946388245604988420610065", "20043822282888088580943075661412089943692408016508860138262379899189777270242", "1"]}

const buildBn128 = require("./src/bn128.js");
const SIZE_F = 32

function buildProofAndVK(bn128) {
    let result = {
      proof: {},
      vk: {}
    };

    /*
    let a_0 = bn128.alloc(96);
    bn128.setG1Affine(a_0, [vk.a[0].x, vk.a[0].y, vk.a[0].z]);
    let a_1 = bn128.alloc(96);
    bn128.setG1Affine(a_1, [vk.a[1].x, vk.a[1].y, vk.a[1].z]);
    */

    //let vk_a_0 = [vk.a[0].x, vk.a[0].y]
    //let vk_a_1 = [vk.a[1].x, vk.a[1].y]

    let vk_a = bn128.alloc(SIZE_F * 6)
    bn128.setG2Affine(vk_a, [vk.a[0], vk.a[1]]);

    //result.proof.a_p = {}
    let a_p = bn128.alloc(SIZE_F * 3)
    //bn128.g1_affine([proof.a_p[0], proof.a_p[1]]);
    bn128.setG1Affine(a_p, proof.a_p);
    //bn128.setG1Affine(a, proof.a);

    //result.proof.a = bn128.g1_affine([proof.a[0], proof.a[1]]);
    let a = bn128.alloc(SIZE_F * 3);
    bn128.setG1Affine(a, proof.a);
    //result.vk.a = bn128.instance.exports.g2_affine([vk.a[0], vk.a[1], vk.a[2]]);

    result = {
        "vk": {
            "a": vk_a
        },
        "proof": {
            "a_p": a_p,
            "a": a
        }
    }

    return result;
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}


let zk = {};

buildBn128().then( (bn128) => {
    zk.bn128 = bn128;

    zk.verify = function(vk, input, proof) {
        loaded_proof = buildProofAndVK(bn128)
        let tmp = bn128.alloc(SIZE_F*3);
        
        /*
        bn128.instance.exports.putBin(vk_x, bn128.instance.exports.g1_fromAffine(["0", "0", "1"]));
        // bn128.instance.exports.putBin(tmp, bn128.instance.exports.g1_fromAffine(["0", "0", "1"]));

            for (uint i = 0; i < proof.input.length(); i++) {
            // vk_x <- vk.IC[i+1] * input[i] + vk_x
            // bn128.instance.exports.putBin(tmp, vk.IC[i+1]);
            bn128.instance.exports.g1_timesScalar(vk.IC[i+1], input[i], 32, tmp);
            bn128.instance.exports.g1_add(vk_x, tmp, vk_x);
        }

        bn128.instance.exports.g1_add(vk_x, vk.IC[0], vk_x);

        */
        bn128.instance.exports.g1m_neg(loaded_proof.proof.a_p, tmp);


        console.log(buf2hex(bn128.getBin(loaded_proof.vk.a, SIZE_F * 6)));
        console.log(buf2hex(bn128.getBin(loaded_proof.proof.a, SIZE_F * 3)));
        console.log(buf2hex(bn128.getBin(tmp, SIZE_F * 3)));
        console.log(buf2hex(bn128.getBin(bn128.pG2gen, SIZE_F * 6)));
        debugger
        if (!bn128.instance.exports.bn128_pairingEq2(loaded_proof.proof.a, loaded_proof.vk.a, tmp, bn128.pG2gen)) {
            console.log("verification failed...");
        }
    }

    zk.verify(vk, proof.input, proof);
});

/*

   function verify(uint[] input, Proof proof) internal returns (uint) {
        VerifyingKey memory vk = verifyKey;
        require(input.length + 1 == vk.IC.length);

        for (uint i = 0; i < input.length; i++)
            vk_x = Pairing.add(vk_x, Pairing.mul(vk.IC[i + 1], input[i]));
        vk_x = Pairing.add(vk_x, vk.IC[0]);

        if (!Pairing.pairingProd2(proof.A, vk.A, Pairing.negate(proof.A_p), Pairing.P2())) return 1;
        if (!Pairing.pairingProd2(vk.B, proof.B, Pairing.negate(proof.B_p), Pairing.P2())) return 2;
        if (!Pairing.pairingProd2(proof.C, vk.C, Pairing.negate(proof.C_p), Pairing.P2())) return 3;
        if (!Pairing.pairingProd3(
            proof.K, vk.gamma,
            Pairing.negate(Pairing.add(vk_x, Pairing.add(proof.A, proof.C))), vk.gammaBeta2,
            Pairing.negate(vk.gammaBeta1), proof.B
        )) return 4;
        if (!Pairing.pairingProd3(
                Pairing.add(vk_x, proof.A), proof.B,
                Pairing.negate(proof.H), vk.Z,
                Pairing.negate(proof.C), Pairing.P2()
        )) return 5;
        return 0;
    }

        proof.A = Pairing.G1Point(a[0], a[1]);
        proof.A_p = Pairing.G1Point(a_p[0], a_p[1]);
        proof.B = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
        proof.B_p = Pairing.G1Point(b_p[0], b_p[1]);
        proof.C = Pairing.G1Point(c[0], c[1]);
        proof.C_p = Pairing.G1Point(c_p[0], c_p[1]);
        proof.H = Pairing.G1Point(h[0], h[1]);
        proof.K = Pairing.G1Point(k[0], k[1]);
        uint[] memory inputValues = new uint[](input.length);
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }

        if (verify(inputValues, proof) == 0) {
            Verified("Transaction successfully verified.");
            return true;
        } else {
            return false;
        }
        */
