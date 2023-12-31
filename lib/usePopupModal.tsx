import { useCallback, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '@redux/reduxHooks';
import {
  ModalSeverities,
  getModalState,
  setPopupModalDetails,
} from '@redux/slices';

type ModalOptions = {
  title: string;
  body: string;
  severity: ModalSeverities;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
};

const usePopupModal = () => {
  const dispatch = useDispatch();
  const modalState = useSelector(getModalState);
  const [onConfirm, setOnConfirm] = useState(() => () => {});
  const [onCancel, setOnCancel] = useState(() => () => {});
  const [onClose, setOnClose] = useState(() => () => {});

  const closeAndClear = () => {
    dispatch(
      setPopupModalDetails({
        title: '',
        body: '',
        severity: 'info',
        state: 'closed',
      })
    );
  };

  const open = useCallback((options: ModalOptions) => {
    if (options.onConfirm) {
      setOnConfirm(() => options.onConfirm);
    }
    if (options.onCancel) {
      setOnCancel(() => options.onCancel);
    }
    if (options.onClose) {
      setOnClose(() => options.onClose);
    }
    const { title, body, severity } = options;
    dispatch(setPopupModalDetails({ title, body, severity, state: 'open' }));
  }, []);

  const close = useCallback(() => {
    onClose();
    closeAndClear();
  }, [onClose]);

  useEffect(() => {
    if (modalState === 'confirmed') {
      onConfirm();
      closeAndClear();
    } else if (modalState == 'canceled') {
      onCancel();
      closeAndClear();
    }
  }, [modalState]);

  return [open, close];
};

export default usePopupModal;
