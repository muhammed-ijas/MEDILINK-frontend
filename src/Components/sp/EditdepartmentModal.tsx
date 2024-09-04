// src/components/EditDepartmentModal.tsx

import React, { useState } from "react";
import {
  Modal,
  Button,
  Input,
  Select,
  TimePicker,
  Form,
  Space,
  Typography,
  Divider,
  message,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { editDepartment } from "../../api/SP"; // Adjust the import path accordingly

const { Option } = Select;
const { Title } = Typography;

interface DoctorInfo {
  _id?: string;
  name: string;
  specialization: string;
  availableFrom: string;
  availableTo: string;
  contact: string;
}

interface DepartmentOption {
  value: string;
  label: string;
  description: string;
}

interface EditDepartmentModalProps {
    open: boolean;
      onClose: () => void;
  departmentData: {
    _id: string;
    name: string;
    description?: string;
    doctors: DoctorInfo[];
  };
  spId: string;
  refreshDepartments: () => void;
}

const departmentOptions: DepartmentOption[] = [
  {
    value: "emergency",
    label: "Emergency Department (ED)",
    description: "Immediate care for acute illnesses and injuries",
  },
  {
    value: "cardiology",
    label: "Cardiology",
    description: "Diagnosis and treatment of heart and vascular conditions",
  },
  {
    value: "neurology",
    label: "Neurology",
    description: "Care for brain, spinal cord, and nervous system disorders",
  },
  {
    value: "pediatrics",
    label: "Pediatrics",
    description: "Medical care for infants, children, and adolescents",
  },
  {
    value: "obstetrics",
    label: "Obstetrics and Gynecology",
    description: "Women’s reproductive health and childbirth",
  },
  {
    value: "oncology",
    label: "Oncology",
    description: "Diagnosis and treatment of cancer",
  },
  {
    value: "orthopedics",
    label: "Orthopedics",
    description: "Treatment of musculoskeletal system issues",
  },
  {
    value: "radiology",
    label: "Radiology",
    description: "Imaging services for diagnosis and treatment",
  },
  {
    value: "pathology",
    label: "Pathology",
    description: "Laboratory analysis of body tissues and fluids",
  },
  {
    value: "surgery",
    label: "General Surgery",
    description: "Surgical procedures for a wide range of conditions",
  },
  {
    value: "urology",
    label: "Urology",
    description: "Treatment of urinary and male reproductive systems",
  },
  {
    value: "dermatology",
    label: "Dermatology",
    description: "Care for skin, hair, and nail conditions",
  },
  {
    value: "gastroenterology",
    label: "Gastroenterology",
    description: "Treatment of digestive system disorders",
  },
  {
    value: "nephrology",
    label: "Nephrology",
    description: "Care for kidney-related conditions",
  },
  {
    value: "pulmonology",
    label: "Pulmonology",
    description: "Treatment of lung and respiratory tract disorders",
  },
  {
    value: "psychiatry",
    label: "Psychiatry",
    description: "Mental health care and treatment",
  },
  {
    value: "endocrinology",
    label: "Endocrinology",
    description: "Treatment of hormonal and metabolic disorders",
  },
  {
    value: "rheumatology",
    label: "Rheumatology",
    description: "Care for autoimmune and inflammatory diseases",
  },
  {
    value: "anesthesiology",
    label: "Anesthesiology",
    description: "Pain management and anesthesia for surgeries",
  },
  {
    value: "icu",
    label: "Intensive Care Unit (ICU)",
    description: "Critical care for severely ill or injured patients",
  },
  {
    value: "infectious-diseases",
    label: "Infectious Diseases",
    description: "Treatment of infections and contagious diseases",
  },
  {
    value: "ophthalmology",
    label: "Ophthalmology",
    description: "Eye care and vision services",
  },
  {
    value: "ent",
    label: "ENT (Otorhinolaryngology)",
    description: "Care for ear, nose, and throat conditions",
  },
  {
    value: "hematology",
    label: "Hematology",
    description: "Treatment of blood disorders",
  },
  {
    value: "physical-medicine",
    label: "Physical Medicine and Rehab",
    description: "Rehabilitation and physical therapy services",
  },
];

const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({
    open,
  onClose,
  departmentData,
  spId,
  refreshDepartments,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: any) => {
    setLoading(true);
    const formattedDoctors = values.doctors.map((doctor: any) => ({
      ...doctor,
      availableFrom: doctor.availableTime[0].format("HH:mm"),
      availableTo: doctor.availableTime[1].format("HH:mm"),
    }));

    const payload = {
      departmentId: departmentData._id,
      name: values.name,
      description: values.description,
      doctors: formattedDoctors,
    };

    try {
      await editDepartment(spId, payload);
      message.success("Department updated successfully!");
      form.resetFields();
      onClose();
      refreshDepartments(); // Refresh department list after update
    } catch (error: any) {
      console.error("Error updating department:", error);
      message.error(error.message || "Failed to update department.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Edit Department"
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          Save Changes
        </Button>,
      ]}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: departmentData.name,
          description: departmentData.description,
          doctors: departmentData.doctors.map((doctor) => ({
            ...doctor,
            availableTime: [
              moment(doctor.availableFrom, "HH:mm"),
              moment(doctor.availableTo, "HH:mm"),
            ],
          })),
        }}
        onFinish={handleFinish}
      >
        <Form.Item
          name="name"
          label="Department Name"
          rules={[
            { required: true, message: "Please select a department name" },
          ]}
        >
          <Select placeholder="Select Department">
            {departmentOptions.map((option) => (
              <Option key={option.value} value={option.label}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Enter department description" />
        </Form.Item>

        <Divider />

        <Title level={4}>Doctors</Title>

        <Form.List name="doctors">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    rules={[{ required: true, message: "Missing doctor name" }]}
                  >
                    <Input placeholder="Doctor's Name" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "specialization"]}
                    rules={[
                      { required: true, message: "Missing specialization" },
                    ]}
                  >
                    <Input placeholder="Specialization" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "availableTime"]}
                    rules={[
                      { required: true, message: "Missing availability time" },
                    ]}
                  >
                    <TimePicker.RangePicker format="HH:mm" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "contact"]}
                    rules={[
                      { required: true, message: "Missing contact number" },
                      {
                        pattern: /^\d{10}$/,
                        message: "Enter a valid 10-digit number",
                      },
                    ]}
                  >
                    <Input placeholder="Contact Number" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Doctor
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default EditDepartmentModal;
