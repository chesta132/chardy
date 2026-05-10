export const reverseSort = (sorts: string[]) => sorts.map((s) => (s.startsWith("-") ? s.slice(1) : `-${s}`));
