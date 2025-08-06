import { addHolding, updateHolding, deleteHolding } from "../../../redux/librarySlice.js";

const dispatchNewPiece = (dispatch, data) => {
    dispatch(addHolding(data));
};

const dispatchUpdatePiece = (dispatch, data) => {
    dispatch(updateHolding(data));
};

const dispatchDeletePiece = (dispatch, data) => {
    dispatch(deleteHolding(data));
};

export {
    dispatchNewPiece,
    dispatchUpdatePiece,
    dispatchDeletePiece
}