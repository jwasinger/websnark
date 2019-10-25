import json
import binascii

public_input = None
vk = None
proof = None

def num_to_hex(g1):
  result = bytearray.fromhex(hex(int(g1))[2:].zfill(64))
  result.reverse()
  return binascii.hexlify(result).decode()

def serialize_f2(x):
  return serialize_f1(x[0]) + serialize_f1(x[1]) + num_to_hex(x[2][0]) + num_to_hex(x[2][1])

def serialize_f1(x):
  if len(x) == 3:
    return num_to_hex(x[0]) + num_to_hex(x[1]) + num_to_hex(x[2])
  else:
    return num_to_hex(x[0]) + num_to_hex(x[1])

with open("public.json") as f:
  public_input = json.load(f)

with open("verification_key.json") as f:
  vk = json.load(f)

with open("proof.json") as f:
  proof = json.load(f)

proof_a = serialize_f1(proof['pi_a'])
proof_b = serialize_f2(proof['pi_b'])
proof_c = serialize_f1(proof['pi_c'])

print("serialized proof:")
print(proof_a)
