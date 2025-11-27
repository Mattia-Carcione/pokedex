/**
* utils/clock
* utilities temporali centralizzate per test e override (es. mock clock nelle unit tests)
*/

export function now(): number {
    return Date.now();
}