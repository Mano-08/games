import { JwtPayload } from "jwt-decode";

export type PropShip = {
  id: string;
  placed: boolean;
  selected: boolean;
  length: number;
};

export type PropBoardCell = {
  ship: boolean;
  details: {
    id: string;
    burst: boolean;
  };
  validHover: boolean | null;
};

export type PropHandlePlaceShip = ({
  ship,
  cindex,
  rindex,
}: {
  ship: PropBoardCell;
  cindex: number;
  rindex: number;
}) => void;

export type PropHandleMouseEnterCell = ({
  rindex,
  cindex,
}: {
  rindex: number;
  cindex: number;
}) => void;

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
}
