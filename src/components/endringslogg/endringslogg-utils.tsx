import { getCrypto } from './crypto';

export function hexString(buffer) {
    const byteArray = new Uint8Array(buffer);

    const hexCodes = [...byteArray].map((value) => {
        const hexCode = value.toString(16);
        const paddedHexCode = hexCode.padStart(2, '0');
        return paddedHexCode;
    });

    return hexCodes.join('');
}

export function krypterVeilederident(veileder: string, versjon: string): Promise<ArrayBuffer> {
    const stringToBeEncoded = `${veileder} - ${versjon}`;
    const utf8Arr: Uint8Array = encodeString(stringToBeEncoded);

    return getCrypto().subtle.digest('SHA-256', utf8Arr);
}

function encodeString(stringToBeEncoded: string): Uint8Array {
    let data;
    // @ts-ignore
    if (typeof TextEncoder === 'undefined') {
        const utf8 = unescape(encodeURIComponent(stringToBeEncoded));
        data = new Uint8Array(utf8.length);
        for (let i = 0; i < utf8.length; i++) {
            data[i] = utf8.charCodeAt(i);
        }
    } else {
        const encoder = new TextEncoder();
        data = encoder.encode(stringToBeEncoded);
    }
    return data;
}

const ENDRING_PREFIX = 'Endringslogg';

export function hentEndringsloggFraLocalstorage(): string[] {
    let a: string[] = [];
    const tmp = localStorage.getItem(ENDRING_PREFIX);
    if (tmp) {
        try {
            a = JSON.parse(tmp);
        } catch (e) {
            // Error handling pga. tidligere versjon som bare lagret en string i LS.
            if(isString(tmp)) {
                a.push(tmp);
            }
            return a;
        }
    }
    return a;
}

function isString(value: any): boolean {
    return typeof value === 'string' || value instanceof String;
}

export function registrerHarLestEndringslogg(versjon: string) {
    const a: string[] = hentEndringsloggFraLocalstorage();
    a.push(versjon);
    window.localStorage.setItem(ENDRING_PREFIX, JSON.stringify(a));
}
