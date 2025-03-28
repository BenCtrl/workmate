import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom';
import { info, warn } from '@tauri-apps/plugin-log';

import { Button, ButtonGroup, Input, Modal } from '../CommonComponents'
import NewStickyNotesGroupModal from '../sticky-notes/NewStickyNotesGroupModal';
import StickyNoteGroup from '../sticky-notes/StickyNoteGroup';
import { IconFolder, IconFolderOpen, IconSearch, IconStack } from '../Icons';

import '../../styling/sitcky-notes-list.css'

import database from '../../database/database';

const NotesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [allGroupsExpanded, setAllGroupsExpanded] = useState(false);

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
      error(`Error while retrieving note groups: ${error}`);
    }
  };

  const toggleGroupExpansion = (expandAllGroups) => {
    setAllGroupsExpanded(expandAllGroups);
    setGroups([]);
    fetchGroups();
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <>
      <div className='workspace-controls'>
        <Button children={<IconStack />} toolTip={'Create new group'} onClick={() => {setShowGroupModal((state) => !state)}} />

        <ButtonGroup>
          <Button children={<IconFolder />} toolTip="Collapse groups" onClick={() => {toggleGroupExpansion(false)}} />
          <Button children={<IconFolderOpen />} toolTip="Expand groups" onClick={() => {toggleGroupExpansion(true)}} />
        </ButtonGroup>

        <Input icon={<IconSearch />} id="note-group-search" className="search-input" placeholder="Search Groups..." value={searchQuery} onChange={(changeEvent) => {setSearchQuery(changeEvent.target.value)}} />
      </div>

      <div id="sticky-notes-list-container" className="scrollable">
        {
          groups.map((group) => {
            let stickyNoteGroup = undefined;

            if (group.id === 1) {
              stickyNoteGroup = <StickyNoteGroup key={group.id} group={group} expanded={true} isDefault={true} />
            } else {
              stickyNoteGroup = <StickyNoteGroup key={group.id} expanded={allGroupsExpanded} getGroups={fetchGroups} group={group} />
            }

            if (searchQuery.length <= 0) {
              return stickyNoteGroup;
            }
            else if (group.title.toLowerCase().includes(searchQuery.toLowerCase())) {
              return stickyNoteGroup;
            }
          })
        }
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