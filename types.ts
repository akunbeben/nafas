export type Cycle = {
    iteration: number;
    count: number;
    mode: 30 | 60;
}

export interface Result {
    state: number;
    cycles: Cycle[];
    average: number;
    mode: 30 | 60;
    age: number;
}
