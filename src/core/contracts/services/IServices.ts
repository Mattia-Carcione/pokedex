export interface IService<T> {
    load(input?: any): Promise<T>;
}
