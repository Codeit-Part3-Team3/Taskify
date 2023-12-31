import { useState, useEffect, Dispatch } from 'react';
import { useSetRecoilState } from 'recoil';
import { cardStateAboutColumn } from '../_recoil/CardAtom';
import { CardInfo } from '../(afterLogin)/_constant/type';
import { FieldValues } from 'react-hook-form';
import { axiosInstance } from '../_util/axiosInstance';
import { updateCardState } from '../_recoil/CardAtom';
import { isAxiosError } from 'axios';
import { CallModalType } from './useRenderModal';
export const usePutCard = (
  cardId: number,
  columnId: number,
  setModalType: Dispatch<React.SetStateAction<React.ReactElement | null>>,
  callModal: CallModalType,
) => {
  const setCards = useSetRecoilState(cardStateAboutColumn(columnId));
  const setCardDataForDetail = useSetRecoilState(updateCardState);
  const [updatedCard, setUpdatedCard] = useState<CardInfo | null>(null);

  const putCard = async (form: FieldValues) => {
    let errorOccurred = false;
    try {
      const res = await axiosInstance.put(`cards/${cardId}`, {
        ...form,
        columnId: +form.columnId,
        assigneeUserId: +form.assigneeUserId,
      });
      setUpdatedCard(res.data);
      setCardDataForDetail(res.data);
    } catch (error) {
      errorOccurred = true;
      if (isAxiosError(error)) {
        const serverErrorMessage = error.response?.data.message;
        return callModal({ name: serverErrorMessage ? serverErrorMessage : error.message });
      }
    } finally {
      if (!errorOccurred) {
        setModalType(null);
      }
    }
  };
  useEffect(() => {
    if (updatedCard !== null) {
      setCards((oldCards: CardInfo[]) => oldCards.map((item) => (item.id === cardId ? updatedCard : item)));
    }
  }, [updatedCard, cardId, setCards]);

  return { putCard, updatedCard };
};
