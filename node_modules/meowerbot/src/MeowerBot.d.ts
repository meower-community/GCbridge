type callback = any;

declare class Bot {
    constructor(username: string, password: string, server: string);
    post(content: string, origin?: string): void;
    onPost(callback: callback): void;
    onClose(callback: callback): void;
    onMessage(callback: callback): void;
    onLogin(callback: callback): void;
    send(message: string): void;
}

export = Bot;