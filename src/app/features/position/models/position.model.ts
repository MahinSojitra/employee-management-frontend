export interface Position {
  id: string;
  title: string;
  description: string;
}

export interface PositionResponse {
  success: boolean;
  message: string;
  data: Position[];
}

export interface SinglePositionResponse {
  success: boolean;
  message: string;
  data: Position;
}
