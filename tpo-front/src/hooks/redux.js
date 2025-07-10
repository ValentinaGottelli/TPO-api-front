import { useDispatch, useSelector } from 'react-redux';

// Hooks tipados para redux
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;