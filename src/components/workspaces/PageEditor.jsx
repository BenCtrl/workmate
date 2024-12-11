import React from 'react';
import { useParams, useLoaderData, useNavigate } from 'react-router-dom';
import { HiArrowUturnLeft } from "react-icons/hi2";
import Button from '../Button';

const PageEditor = () => {
  const { id } = useParams();
  const page = useLoaderData();
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <>
      <div>
        <Button style={{margin: '0'}} children={<HiArrowUturnLeft />} toolTip={"Return to Pages"} onClick={() => {navigateTo("/pages")}} />
      </div>
      {page ? <h1>Page Title: {page.title}</h1> : <h1>New Page</h1>}
    </>
  )
}

const pageLoader = async ({params}) => {
  const response = await fetch(`/api/pages/${params.id}`);
  return await response.json();
}

export { PageEditor as default, pageLoader };