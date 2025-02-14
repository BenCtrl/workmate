import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom';
import { info, warn } from '@tauri-apps/plugin-log';

import { Button, Modal } from '../CommonComponents'
import { Stack } from '../Icons';

import database from '../../database/database';
import NewStickyNotesGroupModal from '../sticky-notes/NewStickyNotesGroupModal';
import StickyNoteGroup from '../sticky-notes/StickyNoteGroup';
import '../../styling/noteslist.css'

const NotesList = () => {
  const [groups, setGroups] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);

  const fetchGroups = async () => {
    try {
      const groups = await database.select('SELECT * FROM note_groups;');

      if (groups.length > 0) {
        info('Successfully retrieved all note groups');
        setGroups(groups);
      } else {
        warn('No note groups returned');
      }
    } catch(error) {
      console.error(`Error while retrieving note groups: ${error}`);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <>
      <div className='sticky-notes-controls'>
        <Button children={<Stack />} toolTip={'Create new group'} onClick={() => {setShowGroupModal((state) => !state)}} />
      </div>
      <div id="notes-list-wrapper">
        {groups.map((group) => {
          // Skip over default group to avoid duplicate render of group (ID is always assumed as 1 as should be primary group)
          return group.id <= 1 ? <StickyNoteGroup key={group.id} group={group} collapsed={true} isDefault={true} /> : <StickyNoteGroup key={group.id} getGroups={fetchGroups} group={group} />
        })}
      </div>

      {showGroupModal &&
        createPortal(
          <Modal children={<NewStickyNotesGroupModal onNewGroupSubmit={fetchGroups} />} onClose={() => setShowGroupModal(false)} modalHeading={'New Notes Group'}/>,
          document.body
        )
      }
    </>
  )
}

export default NotesList;