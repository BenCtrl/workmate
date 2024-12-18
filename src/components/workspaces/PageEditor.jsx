import React, { useState } from 'react';
import { useParams, useLoaderData } from 'react-router-dom';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';

import {
  HiCodeBracket,
  HiArrowUturnLeft,
  HiArrowUturnRight,
  HiCodeBracketSquare,
  HiListBullet
} from "react-icons/hi2";
import { FiBold, FiItalic } from "react-icons/fi";
import { LuSave, LuSaveAll  } from "react-icons/lu";
import { AiOutlineStrikethrough } from "react-icons/ai";
import { GrBlockQuote } from "react-icons/gr";
import { MdOutlineHorizontalRule } from "react-icons/md";
import { GoHeading, GoListOrdered } from "react-icons/go";

import StarterKit from '@tiptap/starter-kit';
import CodeBlock from '@tiptap/extension-code-block';
import TextStyle from '@tiptap/extension-text-style';

import Button from '../Button';
import { addPageLoader, updatePageLoader } from './Pages';
import '../../styling/page-editor.css';

const extensions = [
  StarterKit,
  CodeBlock,
  TextStyle
];

const MenuBar = ({page}) => {
  const {editor} = useCurrentEditor();
  const [pageHeader, setPageHeader] = useState(page ? page.title : 'New Page');
  const [selectedHeading, setSelectedHeading] = useState(1);

  const submitPage = (buttonEvent) => {
    const buttonId = buttonEvent.currentTarget.id;

    // Needs tidying up
    if (page) {
      if (buttonId === 'page-save-as') {
        addPageLoader({
          title: pageHeader,
          description: "",
          dateTimeCreated: Date.now(),
          dateTimeEdited: Date.now(),
          pageContent: editor.getJSON()
        });
      } else {
        updatePageLoader({
          id: page.id,
          title: pageHeader,
          description: "",
          dateTimeCreated: page.dateTimeCreated,
          dateTimeEdited: Date.now(),
          pageContent: editor.getJSON()
        });
      }
    } else {
      addPageLoader({
        title: pageHeader,
        description: "",
        dateTimeCreated: Date.now(),
        dateTimeEdited: Date.now(),
        pageContent: editor.getJSON()
      });
    }

    console.log(buttonEvent.currentTarget.id);
  }

  if (!editor) {
    return null;
  }

  return (
    <>
      <input value={pageHeader} onChange={(changeEvent) => setPageHeader(changeEvent.target.value)} class="page-editor-title"></input>
      <div class="page-editor-nodes">
        <Button toolTip="Undo" children={<HiArrowUturnLeft />} onClick={() => {editor.chain().focus().undo().run()}}/>
        <Button toolTip="Redo" children={<HiArrowUturnRight />} onClick={() => {editor.chain().focus().redo().run()}}/>

        <span className="page-editor-nodes-divider"></span>

        <Button toolTip="Bold" children={<FiBold />} onClick={() => {editor.chain().focus().toggleBold().run()}}/>
        <Button toolTip="Italic" children={<FiItalic />} onClick={() => {editor.chain().focus().toggleItalic().run()}}/>
        <Button toolTip="Strikethrough" children={<AiOutlineStrikethrough  />} onClick={() => {editor.chain().focus().toggleStrike().run()}}/>
        <Button toolTip="Code" children={<HiCodeBracket />} onClick={() => {editor.chain().focus().toggleCode().run()}}/>
        <Button toolTip="Code Block" children={<HiCodeBracketSquare />} onClick={() => {editor.chain().focus().toggleCodeBlock().run()}}/>
        <Button toolTip="Block Quote" children={<GrBlockQuote />} onClick={() => {editor.chain().focus().toggleBlockquote().run()}}/>
        <Button toolTip="Horizontal Rule" children={<MdOutlineHorizontalRule />} onClick={() => {editor.chain().focus().setHorizontalRule().run()}}/>
        <Button toolTip="Bullet List" children={<HiListBullet />} onClick={() => {editor.chain().focus().toggleBulletList().run()}}/>
        <Button toolTip="Bullet List" children={<GoListOrdered />} onClick={() => {editor.chain().focus().toggleOrderedList().run()}}/>

        <span className="page-editor-nodes-divider"></span>

        <Button toolTip="Apply Heading" children={<GoHeading />} onClick={() => {editor.chain().focus().toggleHeading({ level: selectedHeading }).run()}}/>
        <select onChange={(changeEvent) => {setSelectedHeading(parseInt(changeEvent.target.value))}} id="heading-select">

        {/* TODO - Review if heading apply button is better solution than setting heading styling on selection of heading as implemented below */}
        {/* <select onChange={(changeEvent) => {console.log('heading selected'); editor.chain().focus().toggleHeading({ level: parseInt(changeEvent.target.value) }).run()}} id="heading-select"> */}
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>

        <span style={{marginLeft: 'auto'}} className="page-editor-nodes-divider"></span>

        <Button id="page-save-as" children={<LuSaveAll />} toolTip={"Save As"} onClick={(buttonEvent) => {submitPage(buttonEvent)}} />
        <Button id="page-save" children={<LuSave />} toolTip={"Save"} onClick={(buttonEvent) => {submitPage(buttonEvent)}} />
      </div>
    </>
  )
}

const PageEditor = () => {
  const { id } = useParams();
  const page = useLoaderData();
  const content = page ? page.pageContent : '<p style="color: #9d9d9d">Start your new page!</p>';

  return (
    <>
      <EditorProvider
        extensions={extensions}
        content={content}
        editorContainerProps={{className: 'page-editor'}}
        slotBefore={<MenuBar page={page} />}
      ></EditorProvider>
    </>
  )
}

const pageLoader = async ({params}) => {
  const response = await fetch(`/api/pages/${params.id}`);
  return await response.json();
}

export { PageEditor as default, pageLoader };