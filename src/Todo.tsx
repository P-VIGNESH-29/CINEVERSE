import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './redux/store/store';
import { tvshow } from './redux/store/createSlice';

function Todo() {
  const dispatch = useDispatch<AppDispatch>();
  const showstate = useSelector((state: RootState) => state.show);

  useEffect(() => {
    dispatch(tvshow());
  }, [dispatch]);

  console.log(showstate);

  return null;
}

export default Todo;
