import {useEffect} from 'react';
import {Alert, Button, Form, Input, Modal, Select} from 'antd';
const { TextArea } = Input;
import {
  useSendTileSubmissionResponseMutation
} from '../../../data/services/api/event-api.ts';
import { BingoBoardTile } from '../../../data/entities/bingo-board-tile.ts';
import { useEventDetails } from '../EventDetailsPage.tsx';
import {TileSubmissionResponse} from "../../../data/entities/tile-submission";
import dayjs from "dayjs";
import { DATE_FORMAT } from '../../../data/helpers/constants.ts';

type FormSubmissionResponse = Omit<TileSubmissionResponse, 'eventId'>;

interface TileSubmissionResponseModalProps {
  selectedBingoTile: BingoBoardTile,
  open: boolean,
  onCancel: () => void,
  onSuccess: () => void
}

export function TileSubmissionResponseModal({selectedBingoTile, open, onCancel, onSuccess}: TileSubmissionResponseModalProps) {
  const [submitResponse, {isSuccess, isLoading, isError, error}] = useSendTileSubmissionResponseMutation();
  const {event} = useEventDetails();
  const [form] = Form.useForm<FormSubmissionResponse>();

  const selectedSubmissionId = Form.useWatch('submissionId', form);

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
  }, [open]);

  function handleOnFinish(form: FormSubmissionResponse) {
    submitResponse({
      eventId: event.id,
      submissionId: form.submissionId,
      accepted: form.accepted,
      notes: form.notes
    });
  }

  const handleReject = () => {
    form.setFieldValue('accepted', false);
    form.submit();
  };

  const handleAccept = () => {
    form.setFieldValue('accepted', true);
    form.submit();
  };

  const submissions = selectedBingoTile?.submissions?.filter(s => s.judgeId == undefined) || [];
  const selectedSubmission = submissions.find(s => s.id === selectedSubmissionId);
  const evidenceSubmittedAt = selectedSubmission ? dayjs(selectedSubmission.evidenceSubmittedAt).format(DATE_FORMAT) : undefined;

  const initialValues: FormSubmissionResponse = {
    submissionId: undefined,
    accepted: undefined,
    notes: undefined
  }

  return (
    <Modal
      title="Confirm Submission Valid"
      open={open}
      okText='Accept'
      onOk={handleAccept}
      onCancel={onCancel}
      loading={isLoading}
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <Button onClick={handleReject} danger>Reject</Button>
          <OkBtn />
        </>
      )}
    >
      <Form
        className='mt-8'
        form={form}
        disabled={isLoading}
        name="basic"
        initialValues={initialValues}
        onFinish={handleOnFinish}
        autoComplete="off"
      >
        <Form.Item name="accepted" hidden>
          <input type="hidden" />
        </Form.Item>
        <Form.Item label="Submission" name='submissionId'>
          <Select>
            {submissions.map((item) =>
              <Select.Option key={item.id} value={item.id}>{item.userName}</Select.Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item<string>
          label="Notes"
          name="notes"
        >
          <TextArea />
        </Form.Item>
      </Form>

      {selectedSubmission && (
        <Alert
          className='my-4'
          type='info'
          description={'This tile was submitted at: ' + evidenceSubmittedAt}/>
      )}

      {isError &&
        <Alert
          className='my-4'
          type='error'
          description={error?.message}/>
      }
    </Modal>
  )
}