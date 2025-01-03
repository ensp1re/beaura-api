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
  
  export function createUrl(
    itemToReplace?: string,
    replaceWith?: string,
    public_id?: string,
    format?: string,
  ): string {
    return `https://res.cloudinary.com/dzivbyc4z/image/upload/${toStringEffect(itemToReplace!, replaceWith!)}/${public_id}.${format}`;
  }