export function importAll(name: string, func: ((arg: any) => void)) {
    const context = require.context(
        "./",
        true,
        RegExp(`\\.${name}\\.ts$`)
    );
    for (let key of context.keys()) {
        func(context(key).default);
    }
}