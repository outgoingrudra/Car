import React from 'react'
import { dummyUserData } from '../../assets/assets';
import { useLocation } from 'react-router-dom';


export default function Sidebar() {
  const user = dummyUserData ;
  const location = useLocation();
  const [image , setImage] = React.useState('');
  const updateImage =async  () => {
    user.image = URL.createObjectURL(image);
    setImage('')


  return (
    <div>Sidebar</div>
  )
}
