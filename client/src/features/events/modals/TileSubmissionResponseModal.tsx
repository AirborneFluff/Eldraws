import {useEffect} from 'react';
import {Alert, Button, Form, Input, Modal, Select} from 'antd';
const { TextArea } = Input;
import {
  useLazyGetTileSubmissionEvidenceQuery,
  useSendTileSubmissionResponseMutation
} from '../../../data/services/api/bingo-event-api.ts';
import { BingoBoardTile } from '../../../data/entities/bingo-board-tile.ts';
import { useEventDetails } from '../EventDetailsPage.tsx';
import {TileSubmissionResponse} from "../../../data/entities/tile-submission";
import dayjs from "dayjs";
import { DATE_FORMAT } from '../../../data/helpers/constants.ts';
import { MediaTabs } from '../../../core/components/MediaTabs.tsx';

type FormSubmissionResponse = Omit<TileSubmissionResponse, 'eventId'>;

interface TileSubmissionResponseModalProps {
  bingoTile: BingoBoardTile,
  open: boolean,
  onCancel: () => void,
  onSuccess: () => void
}

export function TileSubmissionResponseModal({bingoTile, open, onCancel, onSuccess}: TileSubmissionResponseModalProps) {
  const {event} = useEventDetails();
  const [form] = Form.useForm<FormSubmissionResponse>();

  const [submitResponse, {isSuccess, isLoading, isError, error}] = useSendTileSubmissionResponseMutation();
  const [getEvidence, {data: evidence, isFetching: evidenceFetching}] = useLazyGetTileSubmissionEvidenceQuery();

  const selectedSubmissionId = Form.useWatch('submissionId', form);
  const submissions = bingoTile?.submissions?.filter(s => s.judgeId == undefined) || [];
  const selectedSubmission = submissions.find(s => s.id === selectedSubmissionId);
  const submittedAt = selectedSubmission ? dayjs(selectedSubmission.submittedAt).format(DATE_FORMAT) : undefined;

  useEffect(() => {
    if (selectedSubmissionId) {
      getEvidence({
        eventId: event.id,
        submissionId: selectedSubmissionId
      })
    }
  }, [selectedSubmissionId]);

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    form.setFieldValue('submissionId', submissions[0].id)
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
        className="mt-8"
        form={form}
        disabled={isLoading}
        name="tileSubmission"
        initialValues={initialValues}
        onFinish={handleOnFinish}
        autoComplete="off"
      >
        <Form.Item name="accepted" hidden>
          <input type="hidden"/>
        </Form.Item>
        <Form.Item label="Submission" name="submissionId">
          <Select>
            {submissions.map((item) =>
              <Select.Option key={item.id} value={item.id}>{item.gamertag}</Select.Option>
            )}
          </Select>
        </Form.Item>

        <MediaTabs loading={evidenceFetching} content={evidence} />

        <Form.Item<string>
          label="Notes"
          name="notes"
        >
          <TextArea/>
        </Form.Item>
      </Form>

      {selectedSubmission && (
        <Alert
          className="my-4"
          type="info"
          description={'This tile was submitted at: ' + submittedAt}/>
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