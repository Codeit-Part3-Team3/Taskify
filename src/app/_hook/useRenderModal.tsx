import { useState } from 'react';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { useRecoilState } from 'recoil';

import returnModal from '../_util/returnModal';
import { ToDoCardDetailProps } from '../_component/modal/toDoCard';
import { modalTypeState } from '../_recoil/ModalAtom';

interface CallModalType {
  (condition: {
    name: string;
    onSubmit?: SubmitHandler<FieldValues>;
    cardId?: number;
    cardData?: ToDoCardDetailProps;
    columnId?: number;
  }): void;
}

// 특정 모달 컴포넌트가 담겨져있는 state와 모달호출함수를 리턴하는 커스텀 훅
export default function useRenderModal(): [React.ReactElement | null, CallModalType] {
  const [modalType, setModalType] = useState<React.ReactElement | null>(null);
  const [recoilModalType, setRecoilModalType] = useRecoilState(modalTypeState);

  const callModal: CallModalType = (condition) => {
    const newReturnModal = returnModal({ ...condition, setModalType });
    const modalName = condition.name;
    if (newReturnModal) {
      setModalType(newReturnModal);
      setRecoilModalType(modalName);
    }
  };
  return [modalType, callModal];
}
