export type Cycle = {
    iteration: number;
    count: number;
}

export interface Result {
    cycles: Cycle[];
    average: number;
    mode: 30 | 60;
    age: number;
}
