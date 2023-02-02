export function dirname(path: string) {
  const splits = path.split('/');
  splits.pop();
  return splits.join('/');
}

export function extname(path: string) {
  if (basename(path).startsWith('.')) {
    return '';
  }
  const splits = path.split('.');
  return splits.pop() ?? '';
}

export function basename(path: string, ext = '') {
  const splits = path.split('/');
  const name = splits.pop() ?? '';
  name.replace(ext, '');
  return name;
}
