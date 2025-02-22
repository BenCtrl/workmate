import React, {
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useBeforeUnload, useLoaderData, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { error, info, warn } from '@tauri-apps/plugin-log';

import CharacterCount from '@tiptap/extension-character-count';
import CodeBlock from '@tiptap/extension-code-block';
import { EditorContent, useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { Underline } from '@tiptap/extension-underline';

import { Button, ButtonGroup } from '../CommonComponents';

import {
  IconArrowLeft,
  IconArrowRight,
  IconBold,
  IconCode,
  IconCodeblock,
  IconFileText,
  IconFileAdd,
  IconFileDone,
  IconHorizontalRule,
  IconHeading,
  IconPencil,
  IconInsertRowLeft,
  IconInsertRowRight,
  IconInsertRowAbove,
  IconInsertRowBelow,
  IconItalic,
  IconMergeCells,
  IconOrderedList,
  IconQuoteBlock,
  IconStrikethrough,
  IconSplitCell,
  IconTableHeaderRow,
  IconTableHeaderCell,
  IconTableDeleteColumn,
  IconTableDeleteRow,
  IconTrash,
  IconTable,
  IconUnderline,
  IconUnorderedList,
  IconWarningTriangle,
} from '../Icons';

import '../../styling/page-editor.css';

import database from '../../database/database';
import { AppSettingsContext } from '../../App';
import { addPageLoader, updatePageLoader } from './Pages';

const extensions = [
  StarterKit,
  CodeBlock,
  TextStyle,
  Underline,
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  Placeholder.configure({
    placeholder: 'Start your new page...'
  }),
  CharacterCount.configure({
    wordCounter: (text) => text.split(/\s+/).filter((word) => word !== '').length,
  })
];

const PageEditor = () => {
  const page = useLoaderData();
  const navigate = useNavigate();

  const [pageHeader, setPageHeader] = useState(page ? page.title : 'New Page');
  const [selectedHeading, setSelectedHeading] = useState(1);
  const [changesMade, setChangesMade] = useState(false);
  const [isEditing, setIsEditing] = useState(page ? false : true);
  const [editingTable, setEditableTable] = useState(false);

  const content = page ? JSON.parse(page.page_content) : '';
  const SETTINGS = useContext(AppSettingsContext).appSettings;

  const editor = useEditor({
    extensions,
    content,
    onUpdate: (updateEvent) => {
      setChangesMade(true);
    },
    onSelectionUpdate: (editorUpdate) => {
      const selectionPath = editor.state.selection.$anchor.path;
      let tableFound = false;

      selectionPath.forEach((path) => {
        if (isNaN(path)) {
          if (path.type.name === 'table') {
            tableFound = true;
            return;
          }
        }
      });

      setEditableTable(tableFound);
    }
  });
  
  const submitPage = async (buttonEvent) => {
    let finalPageHeader = pageHeader;
    const buttonId = buttonEvent.currentTarget.id;

    if (buttonId === 'page-save-as') {
      if (await database.select('SELECT * FROM pages WHERE title = $1', [pageHeader]).then(result => {return result.length}) > 0) {
        if (SETTINGS.PREVENT_DUPLICATES) {
          error(`Page cannot be created - Page with title '${pageHeader}' already exists`);
          toast.error(`Page with title '${pageHeader}' already exists`);
          return;
        } else {
          finalPageHeader = `${finalPageHeader}-Copy`;
        }
      }
    }

    if (!finalPageHeader.trim()) {
      error('Page cannot be saved - Title is empty');
      toast.error('Page title cannot be empty');
      return;
    } else if (finalPageHeader.length > 64) {
      error('Page cannot be saved - Character count of title is greater than limit (64 characters)');
      toast.error('Page title too long (no more than 64 characters)');
      return;
    }

    const newPageData = {
      title: finalPageHeader,
      page_content: JSON.stringify(editor.getJSON()),
      created_timestamp: page ? page.created_timestamp : Date.now(),
      edited_timestamp: Date.now()
    }

    // Crude solution for embedding existing page ID into request body, more elegant solution should be found
    if (buttonId !== 'page-save-as' && page) {
      newPageData.id = page.id
    }

    try {
      if (buttonId === 'page-save-as' || buttonId === 'page-save' && !page) {
        const newPageID = await addPageLoader(newPageData);
        navigate(`/pages/editor/${newPageID}`);

        info(`New page with ID '${newPageID}' was successfully created`);
        toast.success(`New page successfully created`);
      } else {
        updatePageLoader(newPageData);

        toast.success('Page successfully saved');
        info(`Page with ID '${newPageData.id}' successfully updated`);
      }

      setChangesMade(false);
    } catch (error) {
      console.error(`Error while attempting to save page: ${error}`);
    }
  }

  useBeforeUnload(useCallback((unloadEvent) => {
    changesMade && unloadEvent.preventDefault();
  }));

  useEffect(() => {
    editor.setEditable(isEditing, false);
  }, [isEditing]);

  return (
    <>
      <div className="page-editor-header">
        <IconWarningTriangle className={`unsaved-changes-icon ${!changesMade && 'hidden'}`} title="Unsaved Changes!" />
        <input title={`${isEditing && SETTINGS.TOOLTIPS ? 'Edit page title':''}`} value={pageHeader} placeholder={'Page Title...'} onChange={(changeEvent) => {setPageHeader(changeEvent.target.value); setChangesMade(true)}} className="page-editor-title" disabled={!isEditing}></input>
        {!isEditing ? <Button toolTip="Edit Page" children={<IconPencil />} onClick={() => {setIsEditing((state) => !state)}}/> : <Button toolTip="View Page" children={<IconFileText />} onClick={() => {setIsEditing((state) => !state)}}/>}
      </div>
      {isEditing &&
        <div className="page-editor-nodes">
          <ButtonGroup>
            <Button className='small' toolTip="Undo" children={<IconArrowLeft />} onClick={() => {editor.chain().focus().undo().run()}}/>
            <Button className='small' toolTip="Redo" children={<IconArrowRight />} onClick={() => {editor.chain().focus().redo().run()}}/>
          </ButtonGroup>

          <ButtonGroup style={{marginLeft: '1rem'}}>
            <Button className={`small ${editor.isActive('bold') ? 'active' : ''}`} toolTip="Bold" children={<IconBold />} onClick={() => {editor.chain().focus().toggleBold().run()}}/>
            <Button className={`small ${editor.isActive('italic') ? 'active' : ''}`} toolTip="Italic" children={<IconItalic />} onClick={() => {editor.chain().focus().toggleItalic().run()}}/>
            <Button className={`small ${editor.isActive('strike') ? 'active' : ''}`} toolTip="Strikethrough" children={<IconStrikethrough />} onClick={() => {editor.chain().focus().toggleStrike().run()}}/>
            <Button className={`small ${editor.isActive('underline') ? 'active' : ''}`} toolTip="Underline" children={<IconUnderline />} onClick={() => {editor.chain().focus().toggleUnderline().run()}}/>
            <Button className={`small ${editor.isActive('code') ? 'active' : ''}`} toolTip="Code" children={<IconCode />} onClick={() => {editor.chain().focus().toggleCode().run()}}/>
            <Button className={`small ${editor.isActive('codeBlock') ? 'active' : ''}`} toolTip="Code block" children={<IconCodeblock />} onClick={() => {editor.chain().focus().toggleCodeBlock().run()}}/>
            <Button className={`small ${editor.isActive('blockquote') ? 'active' : ''}`} toolTip="Block quote" children={<IconQuoteBlock />} onClick={() => {editor.chain().focus().toggleBlockquote().run()}}/>
            <Button className='small' toolTip="Horizontal rule" children={<IconHorizontalRule />} onClick={() => {editor.chain().focus().setHorizontalRule().run()}}/>
            <Button className={`small ${editor.isActive('bulletList') ? 'active' : ''}`} toolTip="Bullet list" children={<IconUnorderedList />} onClick={() => {editor.chain().focus().toggleBulletList().run()}}/>
            <Button className={`small ${editor.isActive('orderedList') ? 'active' : ''}`} toolTip="Ordered list" children={<IconOrderedList />} onClick={() => {editor.chain().focus().toggleOrderedList().run()}}/>
          </ButtonGroup>

          <ButtonGroup style={{marginLeft: '1rem'}}>
            <Button toolTip="Apply heading" className={`small ${editor.isActive('heading') ? 'active' : ''}`} children={<IconHeading />} onClick={() => {editor.chain().focus().toggleHeading({ level: selectedHeading }).run()}}/>

            <select className='small' onChange={(changeEvent) => {setSelectedHeading(parseInt(changeEvent.target.value))}} id="heading-select">
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
              <option value="5">Heading 5</option>
              <option value="6">Heading 6</option>
            </select>
          </ButtonGroup>

          <ButtonGroup style={{marginLeft: '1rem'}}>
            <Button
              className='small'
              toolTip="Insert Table" children={<IconTable />}
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            />
            {editingTable &&
              <>
                <Button
                  className='small'
                  toolTip="Insert column before" children={<IconInsertRowLeft />}
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                />
                <Button
                  className='small'
                  toolTip="Insert column after" children={<IconInsertRowRight />}
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                />
                <Button
                  className='small'
                  toolTip="Insert row before" children={<IconInsertRowAbove />}
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                />
                <Button
                  className='small'
                  toolTip="Insert row after" children={<IconInsertRowBelow />}
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                />
                <Button
                  className='small'
                  toolTip="Delete row" children={<IconTableDeleteRow />}
                  onClick={() => editor.chain().focus().deleteRow().run()}
                />
                <Button
                  className='small'
                  toolTip="Delete column" children={<IconTableDeleteColumn />}
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                />
                <Button
                  className='small'
                  toolTip="Header row" children={<IconTableHeaderRow />}
                  onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                />
                <Button
                  className='small'
                  toolTip="Header cell" children={<IconTableHeaderCell />}
                  onClick={() => editor.chain().focus().toggleHeaderCell().run()}
                />
                <Button
                  className='small'
                  toolTip="Merge cells" children={<IconMergeCells />}
                  onClick={() => editor.chain().focus().mergeCells().run()}
                />
                <Button
                  className='small'
                  toolTip="Split cell" children={<IconSplitCell />}
                  onClick={() => editor.chain().focus().splitCell().run()}
                />
                <Button
                  className='small'
                  toolTip="Split cell" children={<IconTrash />}
                  onClick={() => editor.chain().focus().deleteTable().run()}
                />
              </>
            }
          </ButtonGroup>

          <ButtonGroup style={{marginLeft: 'auto'}}>
            <Button className='small' id="page-save" children={<IconFileDone />} toolTip={changesMade ? "Save (Unsaved Changes)" : "Save"} onClick={(buttonEvent) => {submitPage(buttonEvent)}} disabled={!changesMade} />
            <Button className='small' id="page-save-as" children={<IconFileAdd />} toolTip={"Save As"} onClick={(buttonEvent) => {submitPage(buttonEvent)}} />
          </ButtonGroup>
        </div>
      }

      <EditorContent editor={editor} className='page-editor' />
      {SETTINGS.WORD_COUNTER && <div className="page-editor-word-count">Words: {editor.storage.characterCount.words()}</div>}
    </>
  )
}

const pageLoader = async ({params}) => {
  try {
    const pageID = params.id;
    const pages = await database.select('SELECT * FROM pages WHERE id = $1;', [pageID]);

    if (pages.length > 0) {
      info(`Successfully retrieved page with ID '${pageID}'`);
      return pages[0];
    } else {
      warn(`No page found with ID '${pageID}'`);
      return;
    }
  } catch(error) {
    console.error(`Error while retrieving page with ID '${pageID}': ${error}`);
  }
}

export { PageEditor as default, pageLoader };