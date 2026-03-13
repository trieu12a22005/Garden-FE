import React, { useState } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Table,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { pdf } from '@react-pdf/renderer';
import PrescriptionPdfDocument from '@/components/pdf/PrscriptionPdfDocument';
import type { PrescriptionPdfData } from '@/types/Prescription';
import { UsePrescription } from './usePrescription';
import type { Medicine } from '@/types/medicine';

type MedicineSelected = Medicine & {
  usage: string;
  prescribedQuantity: number;
};

const Prescription: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [form] = Form.useForm();
  const [medicines, setMedicines] = useState<MedicineSelected[]>([]);

  const { medicineOptions = [] } = UsePrescription(keyword);

  const medicineSelectOptions = medicineOptions.map((item) => ({
    label: item.medicineName,
    value: item.medicineID,
  }));

  const itemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const fullLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const handleAddMedicine = () => {
    const medicineId = form.getFieldValue('medicineId');
    const quantity = form.getFieldValue('medicineQuantity');
    const usage = form.getFieldValue('medicineUsage');

    if (!medicineId || !quantity || !usage) {
      message.warning('Vui lòng chọn thuốc, số lượng và cách dùng');
      return;
    }

    const selectedMedicine = medicineOptions.find(
      (item) => item.medicineID === medicineId
    );

    if (!selectedMedicine) {
      message.error('Không tìm thấy thuốc đã chọn');
      return;
    }

    setMedicines((prev) => [
      ...prev,
      {
        ...selectedMedicine,
        prescribedQuantity: quantity,
        usage,
      },
    ]);

    form.setFieldsValue({
      medicineId: undefined,
      medicineQuantity: undefined,
      medicineUsage: '',
    });
  };

  const handleRemoveMedicine = (key: number) => {
    setMedicines((prev) => prev.filter((item) => item.medicineID !== key));
  };

  const columns: ColumnsType<MedicineSelected> = [
    {
      title: 'Tên thuốc',
      dataIndex: 'medicineName',
      key: 'medicineName',
    },
    {
      title: 'Số lượng',
      dataIndex: 'prescribedQuantity',
      key: 'prescribedQuantity',
      width: 120,
    },
    {
      title: 'Cách dùng',
      dataIndex: 'usage',
      key: 'usage',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button danger onClick={() => handleRemoveMedicine(record.medicineID)}>
          Xóa
        </Button>
      ),
    },
  ];

  const buildPdfData = (): PrescriptionPdfData => {
    const values = form.getFieldsValue();

    return {
      name: values.name || '',
      phone: values.phone || '',
      date: values.date ? values.date.format('DD/MM/YYYY') : '',
      gender: values.gender || '',
      address: values.address || '',
      weight: values.weight ? String(values.weight) : '',
      pressure: values.pressure || '',
      type: values.type || '',
      symptom: values.symptom || '',
      diagnose: values.diagnose || '',
      note: values.note || '',
      medicines: medicines.map((item) => ({
        medicineName: item.medicineName,
        quantity: item.prescribedQuantity,
        usage: item.usage,
      })),
    };
  };

  const exportPDF = async () => {
    try {
      const pdfData = buildPdfData();

      const blob = await pdf(
        <PrescriptionPdfDocument data={pdfData} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.src = url;

      iframe.onload = () => {
        const frameWindow = iframe.contentWindow;
        if (frameWindow) {
          frameWindow.focus();
          frameWindow.print();
        }

        window.setTimeout(() => {
          URL.revokeObjectURL(url);
          iframe.remove();
        }, 2000);
      };

      document.body.appendChild(iframe);
    } catch (error) {
      console.error('Export PDF failed:', error);
      message.error('Mở bản in PDF thất bại. Vui lòng thử lại.');
    }
  };

  const onFinish = (values: Record<string, unknown>) => {
    const payload = {
      ...values,
      medicines,
    };
    console.log('submit payload:', payload);
    message.success('Lưu phiếu khám thành công');
  };

  return (
    <div className="px-8 pb-8 mr-[6%]">
      <div className="mt-6 text-center text-2xl font-bold uppercase text-gray-700">
        PHIẾU KHÁM BỆNH
      </div>

      <Form
        form={form}
        layout="horizontal"
        style={{ width: '100%', marginTop: '50px' }}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              {...itemLayout}
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              {...itemLayout}
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              {...itemLayout}
              label="Ngày khám"
              name="date"
              rules={[{ required: true, message: 'Vui lòng chọn ngày khám' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              {...itemLayout}
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
            >
              <Radio.Group>
                <Radio value="Nam">Nam</Radio>
                <Radio value="Nữ">Nữ</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              {...itemLayout}
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              {...itemLayout}
              label="Cân nặng"
              name="weight"
              rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              {...itemLayout}
              label="Huyết áp"
              name="pressure"
              rules={[{ required: true, message: 'Vui lòng nhập huyết áp' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          {...fullLayout}
          label="Loại khám"
          name="type"
          rules={[{ required: true, message: 'Vui lòng chọn loại khám' }]}
        >
          <Select
            options={[
              { label: 'Khám tổng quát', value: 'Khám tổng quát' },
              { label: 'Khám nội', value: 'Khám nội' },
            ]}
          />
        </Form.Item>

        <Form.Item
          {...fullLayout}
          label="Triệu chứng"
          name="symptom"
          rules={[{ required: true, message: 'Vui lòng nhập triệu chứng' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          {...fullLayout}
          label="Chẩn đoán"
          name="diagnose"
          rules={[{ required: true, message: 'Vui lòng nhập chẩn đoán' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          {...fullLayout}
          label="Ghi chú"
          name="note"
          rules={[{ required: true, message: 'Vui lòng nhập ghi chú' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Row gutter={16} className="mt-2">
          <Col span={10}>
            <Form.Item
              label="Tên thuốc"
              name="medicineId"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Select
                showSearch
                placeholder="Nhập để tìm thuốc"
                options={medicineSelectOptions}
                filterOption={false}
                onSearch={(value) => setKeyword(value)}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item
              label="Số lượng"
              name="medicineQuantity"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Cách dùng"
              name="medicineUsage"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
            >
              <Input placeholder="VD: 2 viên/ngày sau ăn" />
            </Form.Item>
          </Col>

          <Col span={2}>
            <Button
              type="primary"
              onClick={handleAddMedicine}
              style={{ marginTop: 4, width: '100%' }}
            >
              Thêm
            </Button>
          </Col>
        </Row>

        <Form.Item
          label="Danh sách thuốc"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <div
            className="
              [&_.ant-table]:border-black
              [&_.ant-table-container]:border-black
              [&_.ant-table-cell]:border-black
              [&_.ant-table-thead>tr>th]:border-black
              [&_.ant-table-thead>tr>th]:bg-gray-100
              [&_.ant-table-thead>tr>th]:font-semibold
              [&_.ant-table-tbody>tr>td]:border-black
            "
          >
            <Table
              rowKey="medicineID"
              bordered
              style={{ marginTop: 16, marginBottom: 24 }}
              columns={columns}
              dataSource={medicines}
              pagination={false}
              locale={{ emptyText: 'Chưa có thuốc nào' }}
            />
          </div>
        </Form.Item>

        <Form.Item
          wrapperCol={{ span: 24 }}
          style={{ textAlign: 'center', marginTop: 24 }}
        >
          <Space>
            <Button
              htmlType="button"
              onClick={() => {
                form.resetFields();
                setMedicines([]);
              }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Lưu phiếu khám
            </Button>
            <Button onClick={exportPDF}>In PDF</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Prescription;