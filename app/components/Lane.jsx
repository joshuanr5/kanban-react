import React from 'react';
import connect from '../libs/connect';
import NoteActions from '../actions/NoteActions';
import Notes from './Notes';
import LaneActions from '../actions/LaneActions';
import LaneHeader from './LaneHeader';
import {compose} from 'redux';
import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

const Lane = ({
    connectDragSource, connectDropTarget, connectDropLaneTarget, isDragging, isOver,
     lane, notes, LaneActions, NoteActions, ...props
}) => {

    const deleteNote = (noteId, e) => {
        e.stopPropagation();
        LaneActions.detachFromLane({
            laneId: lane.id,
            noteId
        });
        
        NoteActions.delete(noteId);
    };

    const activateNoteEdit = (id) => {
        NoteActions.update({id, editing: true});
    };
    const editNote = (id, task) => {
        NoteActions.update({id, task, editing: false});
    };
    const editing = lane.editing;
    const dragSource = editing ? a => a : connectDragSource;
    return compose(connectDropLaneTarget, dragSource, connectDropTarget)(
        <div 
            style={{opacity: isDragging || isOver ? 0 : 1}}
            {...props}>
            <LaneHeader lane={lane}/>
            <Notes 
                notes={selectNotesByIds(notes, lane.notes)}
                onNoteClick={activateNoteEdit}
                onEdit={editNote}
                onDelete={deleteNote} />
        </div>
    );
}

const laneSource = {
    beginDrag(props) {
        const laneId = props.lane.id;
        return {
            id: laneId
        };
    }
}
const laneTarget = {
    hover(targetProps, monitor) {
        const targetLane = targetProps.lane;
        const sourceLaneId = monitor.getItem().id;
        const targetLaneId = targetLane.id;
        if(sourceLaneId !== targetLaneId) {
            LaneActions.moveLane({sourceLaneId, targetLaneId});
        }
    }
}

const noteTarget = {
    hover(targetProps, monitor) {
        const sourceProps = monitor.getItem();
        const noteId = sourceProps.id;
        const targetLane = targetProps.lane;
        const laneId = targetLane.id;
        if(!targetLane.notes.length){
            LaneActions.attachToLane({laneId, noteId});
        }
    }
}

function selectNotesByIds(allNotes, noteIds = []){
    return noteIds.reduce((notes, id) => 
        notes.concat(
            allNotes.filter(note => note.id === id)
        )
    , []);
}

export default compose(
    connect(({notes}) => ({notes}), {NoteActions, LaneActions}),
    DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
        connectDropTarget: connect.dropTarget()
    })),
    DragSource(ItemTypes.LANE, laneSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    })),
    DropTarget(ItemTypes.LANE, laneTarget, (connect, monitor) => ({
        connectDropLaneTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    }))
)(Lane);