export function replaceStringUrl(url: string, uri: string) {
    if(typeof url !== 'string' || typeof uri !== 'string') return '';
    
    const [path,suffix = ''] = url.split(/(?=[?#])/);
    const normalized = path.replace(/\/+$/, '') || "/";
    const lastSlashIndex = normalized.lastIndexOf('/');
    if(lastSlashIndex === -1)
        return `/${uri}${suffix}`;
    const newUrl = normalized.slice(0, lastSlashIndex + 1) + uri;
    return newUrl + suffix;
}