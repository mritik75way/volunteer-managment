import { Modal, Form, Input, DatePicker, Button, InputNumber, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import api from '../../config/api';
import { useAppDispatch } from '../../store/hooks';
import { addOpportunity } from '../../features/opportunities/opportunities.slice';
import { opportunitySchema, type OpportunityFormValues } from '../../features/opportunities/opportunity.schema';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateOpportunityModal = ({ open, onClose }: Props) => {
  const dispatch = useAppDispatch();

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      shifts: [{ startTime: '', endTime: '', capacity: 5 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "shifts"
  });

  const onSubmit = async (data: OpportunityFormValues) => {
    const response = await api.post('/opportunities', data);
    dispatch(addOpportunity(response.data.data.opportunity));
    reset();
    onClose();
  };

  return (
    <Modal
      title="Create New Opportunity"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item label="Event Title" validateStatus={errors.title ? 'error' : ''} help={errors.title?.message}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => <Input {...field} placeholder="e.g., Campus Clean Drive" />}
          />
        </Form.Item>

        <Form.Item label="Location" validateStatus={errors.location ? 'error' : ''} help={errors.location?.message}>
          <Controller
            name="location"
            control={control}
            render={({ field }) => <Input {...field} placeholder="e.g., Central Park" />}
          />
        </Form.Item>

        <Form.Item label="Required Skills" validateStatus={errors.requiredSkills ? 'error' : ''} help={errors.requiredSkills?.message}>
          <Controller
            name="requiredSkills"
            control={control}
            render={({ field }) => (
              <Select 
                {...field}
                mode="multiple" 
                placeholder="Select skills needed for this event"
                options={[
                  { value: 'First Aid', label: 'First Aid' },
                  { value: 'Teaching', label: 'Teaching' },
                  { value: 'Driving', label: 'Driving' },
                  { value: 'Event Planning', label: 'Event Planning' },
                  { value: 'Coding', label: 'Coding' },
                  { value: 'Logistics', label: 'Logistics' },
                ]}
              />
            )}
          />
        </Form.Item>

        <Form.Item label="Description" validateStatus={errors.description ? 'error' : ''} help={errors.description?.message}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => <Input.TextArea {...field} rows={3} placeholder="Describe the event..." />}
          />
        </Form.Item>

        <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
            <h4 className="mb-2 font-semibold text-gray-700">Shifts</h4>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start mb-2">
                <Form.Item 
                  className="mb-0 flex-1"
                  validateStatus={errors.shifts?.[index]?.startTime ? 'error' : ''}
                >
                    <Controller
                        name={`shifts.${index}.startTime`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <DatePicker 
                                showTime 
                                placeholder="Start" 
                                className="w-full"
                                value={value ? dayjs(value) : null}
                                onChange={(date) => onChange(date ? date.toISOString() : '')} 
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item 
                  className="mb-0 flex-1"
                  validateStatus={errors.shifts?.[index]?.endTime ? 'error' : ''}
                >
                    <Controller
                        name={`shifts.${index}.endTime`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <DatePicker 
                                showTime 
                                placeholder="End" 
                                className="w-full"
                                value={value ? dayjs(value) : null}
                                onChange={(date) => onChange(date ? date.toISOString() : '')} 
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item 
                  className="mb-0 w-24"
                  validateStatus={errors.shifts?.[index]?.capacity ? 'error' : ''}
                >
                    <Controller
                        name={`shifts.${index}.capacity`}
                        control={control}
                        render={({ field }) => (
                            <InputNumber {...field} min={1} placeholder="Cap" className="w-full" />
                        )}
                    />
                </Form.Item>

                <Button danger icon={<MinusCircleOutlined />} onClick={() => remove(index)} />
              </div>
            ))}
            
            <Button 
                type="dashed" 
                onClick={() => append({ startTime: '', endTime: '', capacity: 5 })} 
                block 
                icon={<PlusOutlined />}
                className="mt-2"
            >
              Add Shift
            </Button>
        </div>

        <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>Create Event</Button>
        </div>
      </Form>
    </Modal>
  );
};