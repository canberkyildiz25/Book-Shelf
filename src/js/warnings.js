import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

export function showNoBooksAlert() {
  iziToast.show({
    message: 'There are no more books in this category',
    position: 'topRight',
    backgroundColor: '#EAC645',
  });
}