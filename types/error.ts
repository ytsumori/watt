type HandledError = { message: string };

export type Result<T> = ({ data: T } & { error: null }) | ({ data: null } & { error: HandledError });
