export function getStaticRes(path: string): string {
    const realPath = process.env.NODE_ENV !== "github" ? path : process.env.VUE_APP_PATH + path;
    return realPath;
}