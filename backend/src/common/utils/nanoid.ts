import crypto from 'crypto';

export function nanoid(length = 12) {
    return crypto.randomBytes(length).toString('base64').slice(0, length).replace(/[/+]/g, 'a');
}
