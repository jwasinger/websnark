const buildBn128 = require("./src/bn128.js");
const SIZE_F = 32
let zk = {};

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

buildBn128().then( (bn128) => {
    zk.bn128 = bn128;

    zk.verify = function(vk, input, proof) {
        let a = ['21163380042281667028194921861846440787793088615342153907557220755287297358850', '1730005633951488561162401768080055521907218407650744548610087024095695199108'];
        let b = ['8176651290984905087450403379100573157708110416512446269839297438960217797614', '15588556568726919713003060429893850972163943674590384915350025440408631945055'];

        let a_k = [['15347511022514187557142999444367533883366476794364262773195059233657571533367', '4265071979090628150845437155927259896060451682253086069461962693761322642015'], ['2979746655438963305714517285593753729335852012083057917022078236006592638393', '15417615390193197162481139584168488512191689144757183670202567060261951495633']];

        let b_k = [['11559732032986387107991004021392285783925812861821192530917403151452391805634', '10857046999023057135944570762232829481370756359578518086990519993285655852781'], ['4082367875863433681332203403145435568316851327593401208105741076214120093531', '8495653923123431417604973247489272438418190587263600148770280649306958101930']];

	let p_a = bn128.alloc(SIZE_F * 3);
	let p_b = bn128.alloc(SIZE_F * 3);
	let p_a_k = bn128.alloc(SIZE_F * 6);
	let p_b_k = bn128.alloc(SIZE_F * 6);
	    const p_one = bn128.alloc(SIZE_F*6);
	    debugger
	
	    bn128.instance.exports.ftm_one(p_one);
	bn128.setG1Affine(p_a, a);
	bn128.setG1Affine(p_b, b);
	bn128.setG2Affine(p_a_k, a_k);
	bn128.setG2Affine(p_b_k, b_k);

	    /*
        bn128.instance.exports.g1m_toMontgomery(p_a, p_a);
        bn128.instance.exports.g1m_toMontgomery(p_b, p_b);
        bn128.instance.exports.g2m_toMontgomery(p_a_k, p_a_k);
        bn128.instance.exports.g2m_toMontgomery(p_b_k, p_b_k);
	    */

        console.log(buf2hex(bn128.getBin(p_a, SIZE_F * 3)));
        console.log(buf2hex(bn128.getBin(p_b, SIZE_F * 3)));
        console.log(buf2hex(bn128.getBin(p_a_k, SIZE_F * 6)));
        console.log(buf2hex(bn128.getBin(p_b_k, SIZE_F * 6)));
	
        if (!bn128.instance.exports.bn128_pairingEq2(p_a, p_b, p_a_k, p_b_k, p_one)) {
            console.log("verification failed...");
        } else {
            console.log("success!");
	}
    }
    zk.verify();
});
