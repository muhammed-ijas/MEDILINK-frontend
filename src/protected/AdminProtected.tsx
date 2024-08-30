import {Navigate,Outlet} from 'react-router-dom'
import {useSelector} from 'react-redux';
import { RootState } from '../redux/store';

export default function AdminProtected(){
    const {adminInfo} =useSelector((state:RootState)=>state.adminAuth)
    return adminInfo ? <Outlet/>:<Navigate to='/login' replace />
} 