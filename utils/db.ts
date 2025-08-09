import Dexie, { Table } from 'dexie';

export interface Result {
  id?: number;
  enc: string;
  count: number;
  duration: number;
  timestamp: number;
  locale: string;
  timezone: string;
  synced: number;
}

export class Data extends Dexie {
  results!: Table<Result>;

  constructor() {
    super('nafasDB');
    this.version(1).stores({
      results: '++id, enc, count, duration, timestamp, locale, timezone, synced'
    });
  }

  getUnsyncedResults() {
    return this.results.where('synced').equals(0).toArray();
  }
}

export const db = new Data();
