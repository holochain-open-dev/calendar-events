import { CellId } from "@holochain/client";
import { WeInfo } from ".";


export interface WeAppletCellInfo {
  cellId: CellId,
  weInfo: WeInfo,
}