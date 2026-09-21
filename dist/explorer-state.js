import {boards} from './boards.js';
export const normalizeBoard=id=>Object.hasOwn(boards,id)?id:'training';
export function featureIndex(id,index){
 const size=boards[normalizeBoard(id)].hotspots.length;
 return Number.isInteger(index)?((index%size)+size)%size:0;
}
// The eighth Training photo point (optional Trust M) has no upstream GLB geometry.
export function modelFeatureIndex(id,index){
 const board=normalizeBoard(id),count=board==='training'?7:2;
 return Number.isInteger(index)&&index>=0&&index<count?index:null;
}
