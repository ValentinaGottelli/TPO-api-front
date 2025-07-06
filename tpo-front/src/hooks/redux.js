import { useDispatch, useSelector } from 'react-redux';

// Hooks tipados para Redux
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;