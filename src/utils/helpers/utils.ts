export function Sort(data: any[]) {
    console.log('Inizio processo Sort');
    try {
        return data.sort((a, b) => {
            try {
                const idA = Number(a.url.split("/").filter(Boolean).pop());
                const idB = Number(b.url.split("/").filter(Boolean).pop());
                return idA - idB;
            } catch (err) {
                throw new Error(`Sort failed sorting: ${a} and ${b}. \n Error: ${err}`);
            }
        });
    } catch (err) {
        throw new Error(`Sort failed. \n Error: ${err}`);
    }
}