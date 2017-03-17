import React from 'react';
import uuid from 'uuid';
import connect from '../libs/connect';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';
import Editable from '../components/Editable';

const LaneHeader = ({lane, NoteActions, LaneActions, ...props}) => {
    const addNote = (e) => {
        e.stopPropagation();

        const noteId = uuid.v4();

        NoteActions.create({
            id: noteId,
            task: 'New Task'
        });
        LaneActions.attachToLane({
            laneId: lane.id,
            noteId
        });
    }
    const activateLaneEdit = () => {
        LaneActions.update({id: lane.id, editing: true});
    }
    const editName = name => {
        LaneActions.update({id: lane.id, name, editing: false});
    }
    const deleteLane = e => {
        e.stopPropagation();
        const notesId = lane.notes;
        notesId.forEach(id => {
            NoteActions.delete(id);
        });
        LaneActions.delete(lane.id);
    }
    
    return(
        <div className="lane-header" onClick={activateLaneEdit} {...props}>
            <div className="lane-add-note">
                <button onClick={addNote}>+</button>
            </div>
            <Editable
                className="lane-name"
                editing={lane.editing}
                value={lane.name}
                onEdit={editName} />
            <div className="lane-delete">
                <button onClick={deleteLane}>X</button>
            </div>
        </div>
    );
}

export default connect(() => ({}), {NoteActions, LaneActions})(LaneHeader);