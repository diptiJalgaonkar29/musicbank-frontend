if (process.env.NODE_ENV !== "development") {
    console.log = () => { };
    console.group = () => { };
    console.groupCollapsed = () => { };
    console.groupEnd = () => { };
}