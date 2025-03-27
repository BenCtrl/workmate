import React, {
  useContext,
  useEffect,
  useState
} from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { error, info, warn } from '@tauri-apps/plugin-log';

import CharacterCount from '@tiptap/extension-character-count';
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
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconAlignJustify,
  IconSave,
} from '../Icons';

import '../../styling/page-editor.css';

import database from '../../database/database';
import { AppSettingsContext } from '../../App';
import TextAlign from '@tiptap/extension-text-align';

const extensions = [
  StarterKit,
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
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  })
];

const PageEditor = () => {
  const SETTINGS = useContext(AppSettingsContext).appSettings;

  const page = useLoaderData();
  const navigate = useNavigate();

  const [pageTitle, setPageTitle] = useState(page ? page.title : 'New Page');
  const [selectedHeading, setSelectedHeading] = useState(1);

  const [changesMade, setChangesMade] = useState(false);
  const [editingPage, setIsEditing] = useState(() => {
    if (SETTINGS.OPEN_PAGE_IN_EDIT_MODE) {
      return true;
    } else {
      return page ? false : true;
    }
  });
  const [editingTable, setEditingTable] = useState(false);

  const content = page ? JSON.parse(page.page_content) : '';

  const editor = useEditor({
    extensions,
    content,
    onUpdate: (updateEvent) => {
      setChangesMade(true);
    },
    onSelectionUpdate: (editorUpdate) => {
      const cursorSelectionPath = editor.state.selection.$anchor.path;
      let tableFound = false;

      cursorSelectionPath.forEach((path) => {
        if (isNaN(path)) {
          if (path.type.name === 'table') {
            tableFound = true;
            return;
          }
        }
      });

      setEditingTable(tableFound);
    }
  });

  const submitPage = async (buttonEvent) => {
    const isNewPage = buttonEvent.currentTarget.id === 'page-save-as' ? true : false;

    if (!pageTitle.trim()) {
      error('Page cannot be saved - Title is empty');
      toast.error('Page title cannot be empty');
      return;
    } else if (pageTitle.length > 64) {
      error('Page cannot be saved - Character count of title is greater than limit (64 characters)');
      toast.error('Page title too long (no more than 64 characters)');
      return;
    }

    const newPageData = {
      title: pageTitle,
      page_content: JSON.stringify(editor.getJSON()),
      created_timestamp: page ? page.created_timestamp : Date.now(),
      edited_timestamp: Date.now()
    }

    try {
      if (isNewPage || !isNewPage && !page) {
        if (await database.select('SELECT * FROM pages WHERE title = $1', [pageTitle]).then(result => {return result.length}) > 0) {
          if (SETTINGS.PREVENT_DUPLICATES) {
            error(`Page cannot be created - Page with title '${pageTitle}' already exists`);
            toast.error(`Page with title '${pageTitle}' already exists`);
            return;
          } else {
            newPageData.title = `${newPageData.title}-Copy`;
          }
        }

        const response = await database.select(
          'INSERT INTO pages (title, page_content) VALUES ($1, $2) RETURNING id;',
          [newPageData.title, newPageData.page_content]
        );

        if (response.length > 0) {
          const newPageID = response[0].id;
          navigate(`/pages/editor/${newPageID}`);

          info(`New page '${pageTitle}' was successfully created [ID: '${newPageID}']`);
          toast.success(`New page '${newPageData.title}' successfully created`);
        } else {
          error(`Attempted to create new page '${pageTitle}' but no ID was returned`);
          return;
        }
      } else {
        await database.select(
          'UPDATE pages SET title = $1, page_content = $2, edited_timestamp = $3 WHERE id = $4;',
          [newPageData.title, newPageData.page_content, newPageData.edited_timestamp, page.id]
        );

        navigate(`/pages/editor/${page.id}`);

        toast.success(`Page '${page.title}' successfully saved`);
        info(`Page '${page.title}' successfully updated [ID: '${page.id}']`);
      }

      setChangesMade(false);
    } catch (error) {
      error(`Error while attempting to submit page '${pageTitle}' ${page && `[ID: '${page.id}']`}: ${error}`);
    }
  }

  useEffect(() => {
    editor.setEditable(editingPage, false);
  }, [editingPage]);

  return (
    <>
      <div className="page-editor-header">
        <IconWarningTriangle className={`unsaved-changes-icon ${!changesMade && 'hidden'}`} title="Unsaved Changes!" />
        <input title={`${editingPage && SETTINGS.TOOLTIPS ? 'Edit page title':''}`} value={pageTitle} placeholder={'Page Title...'} onChange={(changeEvent) => {setPageTitle(changeEvent.target.value); setChangesMade(true)}} className="page-editor-title" disabled={!editingPage}></input>
        {!editingPage ? <Button toolTip="Edit Page" children={<IconPencil />} onClick={() => {setIsEditing((state) => !state)}}/> : <Button toolTip="View Page" children={<IconFileText />} onClick={() => {setIsEditing((state) => !state)}}/>}
      </div>
      {editingPage &&
        <div className="page-editor-nodes">
          <div className="page-editor-extensions">
            <ButtonGroup>
              <Button className='small' toolTip="Undo" children={<IconArrowLeft />} onClick={() => {editor.chain().focus().undo().run()}}/>
              <Button className='small' toolTip="Redo" children={<IconArrowRight />} onClick={() => {editor.chain().focus().redo().run()}}/>
            </ButtonGroup>

            <ButtonGroup>
              <Button className={`small ${editor.isActive('bold') ? 'active' : ''}`} toolTip="Bold" children={<IconBold />} onClick={() => {editor.chain().focus().toggleBold().run()}}/>
              <Button className={`small ${editor.isActive('italic') ? 'active' : ''}`} toolTip="Italic" children={<IconItalic />} onClick={() => {editor.chain().focus().toggleItalic().run()}}/>
              <Button className={`small ${editor.isActive('strike') ? 'active' : ''}`} toolTip="Strikethrough" children={<IconStrikethrough />} onClick={() => {editor.chain().focus().toggleStrike().run()}}/>
              <Button className={`small ${editor.isActive('underline') ? 'active' : ''}`} toolTip="Underline" children={<IconUnderline />} onClick={() => {editor.chain().focus().toggleUnderline().run()}}/>
              <Button className={`small ${editor.isActive({textAlign:'left'}) ? 'active' : ''}`} toolTip="Align Left" children={<IconAlignLeft />} onClick={() => {editor.chain().focus().setTextAlign('left').run()}}/>
              <Button className={`small ${editor.isActive({textAlign:'center'}) ? 'active' : ''}`} toolTip="Align Center" children={<IconAlignCenter />} onClick={() => {editor.chain().focus().setTextAlign('center').run()}}/>
              <Button className={`small ${editor.isActive({textAlign:'right'}) ? 'active' : ''}`} toolTip="Align Right" children={<IconAlignRight />} onClick={() => {editor.chain().focus().setTextAlign('right').run()}}/>
              <Button className={`small ${editor.isActive({textAlign:'justify'}) ? 'active' : ''}`} toolTip="Align Justify" children={<IconAlignJustify />} onClick={() => {editor.chain().focus().setTextAlign('justify').run()}}/>
            </ButtonGroup>

            <ButtonGroup>
              <Button className={`small ${editor.isActive('code') ? 'active' : ''}`} toolTip="Code" children={<IconCode />} onClick={() => {editor.chain().focus().toggleCode().run()}}/>
              <Button className={`small ${editor.isActive('codeBlock') ? 'active' : ''}`} toolTip="Code block" children={<IconCodeblock />} onClick={() => {editor.chain().focus().toggleCodeBlock().run()}}/>
              <Button className={`small ${editor.isActive('blockquote') ? 'active' : ''}`} toolTip="Block quote" children={<IconQuoteBlock />} onClick={() => {editor.chain().focus().toggleBlockquote().run()}}/>
              <Button className='small' toolTip="Horizontal rule" children={<IconHorizontalRule />} onClick={() => {editor.chain().focus().setHorizontalRule().run()}}/>
              <Button className={`small ${editor.isActive('bulletList') ? 'active' : ''}`} toolTip="Bullet list" children={<IconUnorderedList />} onClick={() => {editor.chain().focus().toggleBulletList().run()}}/>
              <Button className={`small ${editor.isActive('orderedList') ? 'active' : ''}`} toolTip="Ordered list" children={<IconOrderedList />} onClick={() => {editor.chain().focus().toggleOrderedList().run()}}/>
            </ButtonGroup>

            <ButtonGroup>
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

            <ButtonGroup>
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
                    toolTip="Delete table" children={<IconTrash />}
                    onClick={() => editor.chain().focus().deleteTable().run()}
                  />
                </>
              }
            </ButtonGroup>
          </div>

          <div className="page-editor-save-controls">
            <ButtonGroup>
              <Button className='small' id="page-save" children={<IconSave />} toolTip={changesMade ? "Save (Unsaved Changes)" : "Save"} onClick={(buttonEvent) => {submitPage(buttonEvent)}} disabled={!changesMade} />
              <Button className='small' id="page-save-as" children={<IconFileAdd />} toolTip={"Save As"} onClick={(buttonEvent) => {submitPage(buttonEvent)}} />
            </ButtonGroup>
          </div>
        </div>
      }

      <EditorContent editor={editor} className={`page-editor ${SETTINGS.FULL_WIDTH_PAGE_EDITOR ? '' : 'reduced-width scrollable'} ${!SETTINGS.FULL_WIDTH_PAGE_EDITOR && editingPage ? 'editor-border' : ''}`} />
      {SETTINGS.WORD_COUNTER && <div className="page-editor-word-count">Words: {editor.storage.characterCount.words()}</div>}
    </>
  )
}

const pageLoader = async ({params}) => {
  try {
    const pageID = params.id;
    const pages = await database.select('SELECT * FROM pages WHERE id = $1;', [pageID]);

    if (pages.length > 0) {
      const page = pages[0];

      info(`Successfully retrieved page '${page.title}' [ID: '${pageID}']`);
      return page;
    } else {
      warn(`No page found with ID '${pageID}'`);
      return;
    }
  } catch(error) {
    error(`Error while retrieving page with ID '${pageID}': ${error}`);
  }
}

export { PageEditor as default, pageLoader };