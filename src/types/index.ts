export interface Room_Type {
  id: string;
  name: string;
  description: string;
  password: string;
  userX: boolean;
  userY: boolean;
  turn: TURN_TYPE;
  date: Date | string;
}

export enum ERROR_ENUM {
  NONE = 0,
  NAME = 1,
  PASSWORD = 2,
}

export enum TURN_TYPE {
  X = "X",
  O = "O",
  START = "START",
  END = "END",
}

export interface Cell_Type {
  id: number;
  value: CELL_VALUE_TYPE;
}

export enum CELL_VALUE_TYPE {
  NULL = "",
  X = "X",
  O = "O",
}

export enum ERROR_TYPE {
  FULL = "Already printed",
  NO = "",
  END = " The game is over!!!",
}
