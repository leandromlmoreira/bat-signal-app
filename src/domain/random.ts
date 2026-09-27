export type RandomIndex = (bound: number) => number;
export type FillUint32 = (buffer: Uint32Array) => void;

const UINT32_RANGE = 0x100000000;

export function createRandomIndex(fill: FillUint32): RandomIndex {
  const buffer = new Uint32Array(1);
  return (bound) => {
    if (!Number.isInteger(bound) || bound <= 0) {
      throw new RangeError("bound precisa ser um inteiro positivo");
    }
    const limit = UINT32_RANGE - (UINT32_RANGE % bound);
    do {
      fill(buffer);
    } while (buffer[0] >= limit);
    return buffer[0] % bound;
  };
}
