import { randomUUID } from 'node:crypto';

export type AudioRecord = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_name: string;
  file_path: string;
  is_paid: boolean;
  skiza_code: string | null;
  created_at: string;
};

export const audioLibrary: AudioRecord[] = [];

export function createAudioRecord(
  input: Omit<AudioRecord, 'id' | 'created_at'>
): AudioRecord {
  return {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    ...input,
  };
}

export function listAudioRecords() {
  return [...audioLibrary].sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  );
}

export function saveAudioRecord(
  record: AudioRecord
) {
  audioLibrary.push(record);
  return record;
}