import { basename, extname } from './paths';

export function incrementFileName(name: string, isFolder = false): string {
  let namePrefix = name;
  let extSuffix = '';
  if (!isFolder) {
    extSuffix = extname(name);
    namePrefix = basename(name, extSuffix);
  }

  // name copy 5(.txt) => name copy 6(.txt)
  // name copy(.txt) => name copy 2(.txt)
  const suffixRegex = /^(.+ copy)( \d+)?$/;
  if (suffixRegex.test(namePrefix)) {
    return (
      namePrefix.replace(suffixRegex, (match, g1?, g2?) => {
        const number = g2 ? parseInt(g2) : 1;
        // return number === 0
        //   ? `${g1}`
        //   : number < Constants.MAX_SAFE_SMALL_INTEGER
        //   ? `${g1} ${number + 1}`
        //   : `${g1}${g2} copy`;

        return number === 0 ? `${g1}` : `${g1} ${number + 1}`;
      }) + extSuffix
    );
  }

  // name(.txt) => name copy(.txt)
  return `${namePrefix} copy${extSuffix}`;
}
