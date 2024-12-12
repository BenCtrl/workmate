import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineDocumentPlus, HiMiniMagnifyingGlass } from "react-icons/hi2";


import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import '../../styling/pagelist.css'
import Button from '../Button';
import PageListItem from '../PageListItem';

const Pages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rootPages, setRootPages] = useState([]);
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  const fetchPages = async () => {
    try {
        const response = await fetch('/api/pages');
        const data = await response.json();
        setRootPages(data);
    } catch(error) {
        console.log('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <>
      <div id="pages-controls">
        <Button className="page-control" style={{marginLeft: '0', marginRight: 'auto'}} children={<HiOutlineDocumentPlus />} toolTip={"Create New Page"} onClick={() => {navigateTo("/pages/editor")}}/>

        <div id="pages-search" className="search-input text-input page-control">
          <HiMiniMagnifyingGlass  className="search-input-icon" />
          <input placeholder="Search..." value={searchQuery} onChange={(changeEvent) => {setSearchQuery(changeEvent.target.value)}}/>
        </div>
      </div>

      <ul id="pages-list">
        {
          // TODO - Don't really like duplication of return line
          rootPages.map((page) => {
            if (searchQuery.length <= 0) {
              return <PageListItem key={page.id} page={page} />
            }
            else if (page.title.toLowerCase().includes(searchQuery.toLowerCase())) {
              return <PageListItem key={page.id} page={page} />
            }
          })
        }
      </ul>
    </>
  )
}

export default Pages