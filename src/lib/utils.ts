import crypto from 'crypto';

import { IAspectRatioOption } from '@auth/interfaces/main.interface';

export function toLowerCase(str: string): string {
  return str.toLowerCase();
}

//gen_replace:from_sweatshirt;to_t shirt that captures the sky"

export function toStringEffect(
  imageToReplace: string,
  replaceWith: string,
): string {
  return `e_gen_replace:from_${imageToReplace.replace(/ /g, '%20')};to_${replaceWith.replace(/ /g, '%20')}`;
}

export function toAspectRatioString(aspectRatio: IAspectRatioOption): string {
  return `/c_fill,h_${aspectRatio.height},w_${aspectRatio.width}`;
};

//   return `https://res.cloudinary.com/dzivbyc4z/image/upload/${toStringEffect(itemToReplace!, replaceWith!)}${aspectRatio ? toAspectRatioString(aspectRatio) : ''}${isQuality ? '/e_sharpen' : ''}/${public_id}.${format}`;


export function createUrl(
  itemToReplace?: string,
  replaceWith?: string,
  public_id?: string,
  format?: string,
  // aspectRatio?: IAspectRatioOption,
  isQuality?: boolean,

): string {
  return `https://res.cloudinary.com/dzivbyc4z/image/upload/${toStringEffect(itemToReplace!, replaceWith!)}${isQuality ? '/e_sharpen' : ''}/${public_id}.${format}`;
}

export const generateHashPassword = (): string => {
  return crypto.randomBytes(16).toString('hex');
};