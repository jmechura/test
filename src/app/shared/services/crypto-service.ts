import { Injectable } from '@angular/core';

export interface IEncryptPinBlockModel {
  pin: string;
  pan: string;
  rsaPublicKey: CryptoKey;
}

export interface IEncryptedPinBlock {
  pinBlockHex: string;
  aesKeyHex: string;
}

@Injectable()
export class EncryptPinBlockService {
  private subtle: SubtleCrypto;

  constructor() {
    this.subtle = window.crypto.subtle;
  }

  async encryptPinBlock({pin, pan, rsaPublicKey}: IEncryptPinBlockModel): Promise<IEncryptedPinBlock> {
    const pinBlock = this.genFormat0(pin, pan);
    // console.debug('pinBlock=', pinBlock);
    const aesKey = await this.generateAesEncryptionKey();
    // console.debug('aesKey=', aesKey);
    const encPinBlock = await this.encryptUsingAesKey(aesKey, pinBlock.pinBlock);
    // console.debug('encPinBlock=', encPinBlock, ', encPinBlockHex=', this.fromByteArray(encPinBlock));
    const aesKeyRaw = await this.exportRawAesEncryptionKey(aesKey);
    // console.debug('aesKeyRaw=', aesKeyRaw, ', aesKeyRawHex=', this.fromByteArray(aesKeyRaw));
    const encAesKey = await this.encryptUsingRsaKey(rsaPublicKey, aesKeyRaw);
    // console.debug('encAesKey=', encAesKey, ', encAesKeyHex=', this.fromByteArray(encAesKey));

    const encryptedPinBlock = {
      pinBlockHex: this.fromByteArray(encPinBlock),
      aesKeyHex: this.fromByteArray(encAesKey),
    };

    return encryptedPinBlock;
  }

  async importPublicKey(jwkObj: JsonWebKey): Promise<CryptoKey> {
    return this.subtle
      .importKey('jwk', jwkObj, {name: 'RSA-OAEP', hash: {name: 'SHA-256'}}, false, ['encrypt']);
  }

  /*================================ PIN BLOCK =================================*/

  /*================================ PIN BLOCK =================================*/
  /**
   * https://en.wikipedia.org/wiki/ISO_9564#Format_0
   */
  private genFormat0(pin: string, pan: string): any {
    /**
     * The plain text PIN field is:
     *
     * * one nibble with the value of 0, which identifies this as a format 0 block
     * * one nibble encoding the length N of the PIN
     * * N nibbles, each encoding one PIN digit
     * * 14−N nibbles, each holding the "fill" value 15 (i.e. 11112)
     */
    const pinPad = 'ffffffffffffff';
    const pinHexString = `0${pin.length}${pin}${pinPad}`.slice(0, 16);

    /**
     * The account number field is:
     *
     * * four nibbles with the value of zero
     * * 12 nibbles containing the right-most 12 digits of the primary account number (PAN), excluding the check digit
     */
    const panR12 = pan.slice(-13, -1);
    const panHexString = `0000${panR12}`;

    const pinArray = this.toByteArray(pinHexString);
    const panArray = this.toByteArray(panHexString);

    /**
     * The PIN block is constructed by XOR-ing two 64-bit fields: the plain text PIN field and the account number field,
     * both of which comprise 16 four-bit nibbles.
     */
    const pinBlock = new Uint8Array(8);
    for (let i = 0; i < pinBlock.length; i++) {
      // tslint:disable-next-line:no-bitwise
      pinBlock[i] = pinArray[i] ^ panArray[i];
    }

    return {
      format: 'ISO-9564-1',
      pinBlock,
      hexEncodedPinBlock: this.fromByteArray(pinBlock),
    };
  }

  /*================================ HEX UTILS =================================*/
  /**
   *
   * @param hexStr
   */
  private toByteArray(hexStr: string): Uint8Array {
    const byteArray = hexStr
    /**
     * Javascript elegant way to split string into segments n characters long
     *
     * https://stackoverflow.com/questions/6259515/javascript-elegant-way-to-split-string-into-segments-n-characters-long
     */
      .match(/.{1,2}/g)
      /**
       * Hex2Number
       *
       * https://stackoverflow.com/questions/10121507/converting-a-hex-string-into-a-byte-array-js
       */
      .map(s => Number.parseInt(s, 16));

    /**
     * Uint8Array
     *
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
     */
    return Uint8Array.from(byteArray);
  }

  /*================================ HEX UTILS =================================*/

  /**
   *
   * @param array
   */
  private fromByteArray(array: Uint8Array): string {
    return Array.from(array).map(b => ('0' + b.toString(16)).slice(-2)).join('');
  }

  /*=============================== CRYPTO UTILS ===============================*/
  private async generateAesEncryptionKey(): Promise<CryptoKey> {
    const aesKeyGenParams: AesKeyGenParams = {
      name: 'AES-CBC',
      length: 256
    };

    return this.subtle.generateKey(aesKeyGenParams, true, ['encrypt']);
  }

  private async exportRawAesEncryptionKey(key: CryptoKey): Promise<Uint8Array> {
    const b = await this.subtle.exportKey('raw', key);

    return new Uint8Array(b);
  }

  private async encryptUsingAesKey(key: CryptoKey, data: Uint8Array): Promise<Uint8Array> {
    const params: AesCbcParams = {
      name: 'AES-CBC',
      iv: new Uint8Array(16),
    };
    const b = await this.subtle.encrypt(params, key, data);

    return new Uint8Array(b);
  }

  private async encryptUsingRsaKey(key: CryptoKey, data: Uint8Array): Promise<Uint8Array> {
    const b = await this.subtle.encrypt('RSA-OAEP', key, data);

    return new Uint8Array(b);
  }

  /*=============================== CRYPTO UTILS ===============================*/
}
