import React, { useState } from 'react';
import { useParams, useLoaderData, useNavigate } from 'react-router-dom';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';

import {
  HiCodeBracket,
  HiArrowUturnLeft,
  HiArrowUturnRight,
  HiCodeBracketSquare,
  HiOutlineFolder
} from "react-icons/hi2";

import StarterKit from '@tiptap/starter-kit';
import CodeBlock from '@tiptap/extension-code-block';
import Button from '../Button';
import { addPageLoader } from './Pages';
import '../../styling/page-editor.css';

const extensions = [StarterKit, CodeBlock];


const MenuBar = ({page}) => {
  const {editor} = useCurrentEditor();
  const [pageHeader, setPageHeader] = useState(page ? page.title : 'New Page');

  const submitNewPage = () => {
    addPageLoader({
      title: pageHeader,
      description: "",
      dateTimeCreated: Date.now(),
      dateTimeEdited: Date.now(),
      pageContent: editor.getJSON()
    },);
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
        <span style={{borderRight: '1px solid black'}}></span>
        <Button toolTip="Bold" children={<b>B</b>} onClick={() => {editor.chain().focus().toggleBold().run()}}/>
        <Button toolTip="Italic" children={<i>I</i>} onClick={() => {editor.chain().focus().toggleItalic().run()}}/>
        <Button toolTip="Code" children={<HiCodeBracket />} onClick={() => {editor.chain().focus().toggleCode().run()}}/>
        <Button toolTip="Code Block" children={<HiCodeBracketSquare />} onClick={() => {editor.chain().focus().toggleCodeBlock().run()}}/>
        <Button style={{margin: '0'}} children={<HiOutlineFolder />} toolTip={"Save Page"} onClick={() => {submitNewPage()}} />
      </div>
    </>
  )
}

const PageEditor = () => {
  const { id } = useParams();
  const page = useLoaderData();
  const content = page ? page.pageContent : '<p>Start your new page!</p>';

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