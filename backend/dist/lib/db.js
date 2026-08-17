import { randomUUID } from 'node:crypto';
export const audioLibrary = [];
export function createAudioRecord(input) {
    return {
        id: randomUUID(),
        created_at: new Date().toISOString(),
        ...input,
    };
}
export function listAudioRecords() {
    return [...audioLibrary].sort((a, b) => b.created_at.localeCompare(a.created_at));
}
export function saveAudioRecord(record) {
    audioLibrary.push(record);
    return record;
}
