import fs from "node:fs";
import path from "path";
const stateDir = path.resolve("src/states/state.json");

export function isDateWithinSixMonth(): boolean {
    const date = getSavedDate();
    if(!date) {
        saveDate(new Date());
        return true;
    }
    if(isWithinSixMonths(date)) return true;
    return false;
} 

function getSavedDate(): Date | null {
    try {
        const dir = path.dirname(stateDir);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            const dateObj = { lastFetch: new Date().toISOString() };
            fs.writeFileSync(stateDir, JSON.stringify(dateObj));
        }
        const raw = fs.readFileSync(stateDir, "utf8");
        const data = JSON.parse(raw);
        return data.lastFetch ? new Date(data.lastFetch) : null;
    } catch (err) {
        throw err;
    }
}

function saveDate(date: Date): void {
    try {
        fs.writeFileSync(stateDir, JSON.stringify({ lastFetch: date }));
    } catch (err) {
        throw err;
    }
}

function isWithinSixMonths(last: Date): boolean {
    try {
        const sixMonthsLater = new Date(last);
        sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
        return new Date() < sixMonthsLater;
    } catch (err) {
        throw err;
    }
}