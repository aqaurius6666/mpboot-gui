export const getRelativePath = (path : string, rootPath: string) => {
    return path.replace(rootPath, '').slice(1);
}